import { ADMIN, CLIENT, TOKEN_KEY, USER_KEY } from '../support/commands';

interface ApiGame {
  id: string;
  title: string;
  price: number;
  originalPrice: number;
  discount: number;
}

const apiUrl = () => Cypress.expose('apiUrl') as string;

function setBrowserSession(
  accessToken: string,
  user: { id: string; email: string; role: 'admin' | 'client' },
) {
  cy.setCookie(TOKEN_KEY, accessToken);
  cy.visit('/');
  cy.window().then((win) => {
    win.localStorage.setItem(TOKEN_KEY, accessToken);
    win.localStorage.setItem(USER_KEY, JSON.stringify(user));
  });
}

function getFirstGame(adminToken: string): Cypress.Chainable<ApiGame> {
  return cy
    .request<{ items?: ApiGame[]; data?: ApiGame[] } | ApiGame[]>({
      method: 'GET',
      url: `${apiUrl()}/games?limit=6`,
      headers: { Authorization: `Bearer ${adminToken}` },
    })
    .then((res) => {
      const list = Array.isArray(res.body)
        ? res.body
        : (res.body.items ?? res.body.data ?? []);
      expect(list.length, 'debe haber al menos un juego sembrado').to.be.greaterThan(0);
      return list[0];
    });
}

describe('Comunicación en tiempo real con WebSockets y JWT', () => {
  before(() => {
    cy.seed();
  });

  it('no abre conexión WebSocket si el usuario no ha iniciado sesión', () => {
    cy.visit('/');
    cy.get('[data-testid="realtime-status"]').should('not.exist');
  });

  it('autentica el handshake JWT y muestra el indicador "En vivo"', () => {
    cy.loginAs(CLIENT);
    cy.visit('/');
    cy.get('[data-testid="realtime-status"]')
      .should('have.attr', 'data-status', 'connected')
      .and('contain.text', 'En vivo');
  });

  it('sincroniza cambios de descuento en vivo sin recargar la página', () => {
    cy.apiLogin(ADMIN).then(({ accessToken: adminToken }) => {
      getFirstGame(adminToken).then((game) => {
        const originalDiscount = Number(game.discount ?? 0);
        const nextDiscount = originalDiscount === 25 ? 35 : 25;

        cy.loginAs(CLIENT);
        cy.visit('/');
        cy.get('[data-testid="realtime-status"]').should(
          'have.attr',
          'data-status',
          'connected',
        );
        cy.contains('article', game.title);

        // El administrador cambia el descuento vía API mientras el cliente permanece en /
        cy.request({
          method: 'PATCH',
          url: `${apiUrl()}/games/${game.id}/discount`,
          headers: { Authorization: `Bearer ${adminToken}` },
          body: { discount: nextDiscount },
        }).its('status').should('eq', 200);

        // Sin recargar: llega el toast y se actualiza el badge de descuento en el store de Redux
        cy.contains('[data-testid="toast"]', `${game.title} ahora con -${nextDiscount}%`);
        cy.contains('article', game.title).should('contain.text', `-${nextDiscount}%`);

        // Restauramos el descuento original para no dejar datos sucios
        cy.request({
          method: 'PATCH',
          url: `${apiUrl()}/games/${game.id}/discount`,
          headers: { Authorization: `Bearer ${adminToken}` },
          body: { discount: originalDiscount },
        });
      });
    });
  });

  it('dispara una alerta de precio en vivo en /wishlist cuando un juego alcanza el precio objetivo', () => {
    cy.apiLogin(ADMIN).then(({ accessToken: adminToken }) => {
      getFirstGame(adminToken).then((game) => {
        const originalDiscount = Number(game.discount ?? 0);
        const originalPrice = Number(game.originalPrice ?? game.price);

        // Aseguramos que empiece sin descuento para que el precio objetivo sea alcanzable
        cy.request({
          method: 'PATCH',
          url: `${apiUrl()}/games/${game.id}/discount`,
          headers: { Authorization: `Bearer ${adminToken}` },
          body: { discount: 0 },
        });

        const targetPrice = Math.max(1, Math.floor(originalPrice * 0.7));

        cy.registerUser('rt_alert').then((client) => {
          cy.request({
            method: 'POST',
            url: `${apiUrl()}/wishlist`,
            headers: { Authorization: `Bearer ${client.accessToken}` },
            body: { gameId: game.id, targetPrice },
          });

          setBrowserSession(client.accessToken, {
            id: client.id,
            email: client.email,
            role: 'client',
          });

          cy.visit('/wishlist');
          cy.get('[data-testid="realtime-status"]').should(
            'have.attr',
            'data-status',
            'connected',
          );
          cy.contains(game.title);

          // Aplicamos 50% de descuento (baja por debajo del 70% del precio original)
          cy.request({
            method: 'PATCH',
            url: `${apiUrl()}/games/${game.id}/discount`,
            headers: { Authorization: `Bearer ${adminToken}` },
            body: { discount: 50 },
          }).its('status').should('eq', 200);

          // Sin recargar: aparece la notificación toast y el banner de alertas de precio
          cy.contains('[data-testid="toast"]', `${game.title} alcanzó tu precio objetivo`);
          cy.get('[data-testid="price-alerts"]').should('contain.text', game.title);

          // Restauramos el descuento original
          cy.request({
            method: 'PATCH',
            url: `${apiUrl()}/games/${game.id}/discount`,
            headers: { Authorization: `Bearer ${adminToken}` },
            body: { discount: originalDiscount },
          });
        });
      });
    });
  });
});
