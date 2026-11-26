import { ADMIN, TOKEN_KEY, USER_KEY } from '../support/commands';

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

describe('Wishlist, compras y biblioteca del usuario', () => {
  before(() => {
    cy.seed();
  });

  it('permite agregar un juego a la wishlist con precio objetivo y luego quitarlo', () => {
    cy.registerUser('wish').then((user) => {
      setBrowserSession(user.accessToken, {
        id: user.id,
        email: user.email,
        role: 'client',
      });

      cy.visit('/');
      cy.get('article').first().as('firstCard');

      cy.get('@firstCard')
        .find('h3 a')
        .invoke('text')
        .then((rawTitle) => {
          const title = rawTitle.trim();

          cy.get('@firstCard').contains('button', 'Agregar a wishlist').click();

          // Valida que no acepte un precio objetivo mayor o igual al actual
          cy.get('@firstCard').find('input[type="number"]').type('99999');
          cy.get('@firstCard').contains('button', 'Guardar').click();
          cy.get('@firstCard').contains('[role="alert"]', 'Debe ser menor al precio actual');

          // Ingresa un precio objetivo válido y guarda
          cy.get('@firstCard').find('input[type="number"]').clear().type('0.50');
          cy.get('@firstCard').contains('button', 'Guardar').click();
          cy.contains('[data-testid="toast"]', `${title} agregado a tu wishlist`);
          cy.get('@firstCard').contains('En tu wishlist');

          // Verifica que aparezca en /wishlist y permite eliminarlo
          cy.visit('/wishlist');
          cy.contains(title);
          cy.contains('button', /Quitar/i).first().click();
          cy.contains('[data-testid="toast"]', 'se quitó de tu wishlist');
        });
    });
  });

  it('permite comprar un juego y verlo reflejado en /library y /purchases', () => {
    cy.apiLogin(ADMIN).then(({ accessToken: adminToken, user: adminUser }) => {
      const uniqueTitle = `Cypress Test Game ${Date.now()}`;

      cy.request<ApiGame>({
        method: 'POST',
        url: `${apiUrl()}/games`,
        headers: { Authorization: `Bearer ${adminToken}` },
        body: {
          title: uniqueTitle,
          description: 'Juego temporal creado para verificar el flujo E2E de compra.',
          price: 5,
          developer: 'Cypress Studio',
          releaseDate: '2026-01-15',
        },
      }).then((createdRes) => {
        const game = createdRes.body;
        expect(game.id, 'el juego creado debe tener id').to.exist;

        setBrowserSession(adminToken, adminUser);

        cy.visit(`/games/${game.id}`);
        cy.get(`[data-testid="buy-${game.id}"]`).click();

        cy.get('[data-testid="confirm-purchase-dialog"]').should('be.visible');
        cy.get('[data-testid="confirm-purchase"]').should('not.be.disabled').click();

        cy.contains('En tu biblioteca');

        cy.visit('/library');
        cy.contains(game.title);

        cy.visit('/purchases');
        cy.contains(game.title);
      });
    });
  });
});
