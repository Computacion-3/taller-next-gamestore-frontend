import {
  ADMIN,
  CLIENT,
  TOKEN_KEY,
  USER_KEY,
  fakeJwt,
} from '../support/commands';

const PRIVATE_ROUTES = ['/users', '/library', '/wishlist', '/purchases', '/profile'];

describe('Control de acceso por sesión y roles', () => {
  describe('Visitante sin sesión', () => {
    PRIVATE_ROUTES.forEach((route) => {
      it(`${route} redirige a /login con ?redirect`, () => {
        cy.visit(route);
        cy.location('pathname').should('eq', '/login');
        cy.location('search').should('include', `redirect=${encodeURIComponent(route)}`);
      });
    });

    it('tras iniciar sesión vuelve a la ruta que quería visitar', () => {
      cy.visit('/users');
      cy.get('main form fieldset').should('not.be.disabled');
      cy.get('#login-email').type(ADMIN.email);
      cy.get('#login-password').type(ADMIN.password, { log: false });
      cy.get('main form button[type="submit"]').click();
      cy.location('pathname').should('eq', '/users');
      cy.get('[data-testid="users-table"]').should('be.visible');
    });

    it('las rutas públicas siguen abiertas', () => {
      cy.visit('/');
      cy.location('pathname').should('eq', '/');
    });
  });

  describe('Cliente (sin authority users:manage)', () => {
    beforeEach(() => {
      cy.loginAs(CLIENT);
    });

    it('/users lo manda a la vista 403', () => {
      cy.visit('/users');
      cy.location('pathname').should('eq', '/forbidden');
      cy.get('[data-testid="access-denied"]').should('contain', '403');
    });

    it('no ve el enlace de administración en el Header', () => {
      cy.visit('/');
      cy.contains('header', CLIENT.email);
      cy.contains('header a', 'USUARIOS').should('not.exist');
      cy.contains('header a', 'Gestión de Roles').should('not.exist');
    });
  });

  describe('Administrador', () => {
    beforeEach(() => {
      cy.loginAs(ADMIN);
    });

    it('accede a /users', () => {
      cy.visit('/users');
      cy.location('pathname').should('eq', '/users');
      cy.get('[data-testid="users-table"]').should('be.visible');
    });

    it('ve el enlace de administración en el Header', () => {
      cy.visit('/');
      cy.contains('header a', 'USUARIOS');
    });
  });

  describe('Tokens manipulados', () => {
    it('un token vencido se descarta y pide iniciar sesión', () => {
      const expired = fakeJwt({
        sub: 'x',
        email: 'x@store.com',
        role: 'admin',
        exp: Math.floor(Date.now() / 1000) - 60,
      });
      cy.setCookie(TOKEN_KEY, expired);
      cy.visit('/users');
      cy.location('pathname').should('eq', '/login');
      cy.getCookie(TOKEN_KEY).should('not.exist');
    });

    it('un token falsificado con rol admin no obtiene datos: el backend lo rechaza (401) y se cierra la sesión', () => {
      const forged = fakeJwt({
        sub: 'x',
        email: 'falso@store.com',
        role: 'admin',
        exp: Math.floor(Date.now() / 1000) + 3600,
      });
      cy.setCookie(TOKEN_KEY, forged);
      cy.visit('/users', {
        onBeforeLoad(win) {
          win.localStorage.setItem(TOKEN_KEY, forged);
          win.localStorage.setItem(
            USER_KEY,
            JSON.stringify({ id: 'x', email: 'falso@store.com', role: 'admin' }),
          );
        },
      });
      // El proxy solo decodifica el token; la seguridad real está en el backend.
      // Al abrir la app se valida con GET /auth/profile y, al recibir 401,
      // la sesión se limpia: nunca se listan usuarios.
      cy.get('[data-testid="access-denied"]').should('contain', '401');
      cy.get('[data-testid="users-table"]').should('not.exist');
      cy.getCookie(TOKEN_KEY).should('not.exist');
    });
  });
});
