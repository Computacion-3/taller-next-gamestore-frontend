import { ADMIN, CLIENT, Credentials, TOKEN_KEY } from '../support/commands';

function loginViaUi({ email, password }: Credentials) {
  cy.visit('/login');
  cy.get('#login-email').type(email);
  cy.get('#login-password').type(password, { log: false });
  cy.get('form button[type="submit"]').click();
}

describe('Autenticación y sesión JWT', () => {
  describe('Login', () => {
    it('valida los campos vacíos sin llamar al backend', () => {
      cy.visit('/login');
      cy.get('form button[type="submit"]').click();
      cy.contains('[role="alert"]', 'Por favor ingresa tu correo');
      cy.location('pathname').should('eq', '/login');
    });

    it('rechaza credenciales inválidas y muestra el error', () => {
      loginViaUi({ email: ADMIN.email, password: 'incorrecta' });
      cy.contains('[role="alert"]', 'Credenciales inválidas');
      cy.location('pathname').should('eq', '/login');
      cy.getCookie(TOKEN_KEY).should('not.exist');
    });

    it('inicia sesión como administrador y guarda el JWT', () => {
      loginViaUi(ADMIN);
      cy.location('pathname').should('eq', '/');
      cy.contains('header', ADMIN.email);
      cy.contains('header button', 'Cerrar sesión');
      cy.getCookie(TOKEN_KEY).should('exist');
      cy.window().its('localStorage').invoke('getItem', TOKEN_KEY).should('exist');
    });

    it('acepta el alias de usuario del backend ("admin")', () => {
      loginViaUi({ email: 'admin', password: 'admin' });
      cy.contains('header', ADMIN.email);
    });

    it('un usuario con sesión no puede volver a /login', () => {
      cy.loginAs(CLIENT);
      cy.visit('/login');
      cy.location('pathname').should('eq', '/');
    });
  });

  describe('Registro', () => {
    it('crea una cuenta nueva con rol client e inicia sesión', () => {
      const email = `registro_${Date.now()}@store.com`;
      cy.visit('/register');
      cy.get('#register-email').type(email);
      cy.get('#register-password').type('Password123', { log: false });
      cy.get('#register-confirm-password').type('Password123', { log: false });
      cy.get('form button[type="submit"]').click();

      cy.location('pathname').should('eq', '/');
      cy.contains('header', email);
      cy.contains('header', /client/i);
      cy.contains('header a', 'USUARIOS').should('not.exist');
    });

    it('rechaza un correo ya registrado', () => {
      cy.visit('/register');
      cy.get('#register-email').type(ADMIN.email);
      cy.get('#register-password').type('Password123', { log: false });
      cy.get('#register-confirm-password').type('Password123', { log: false });
      cy.get('form button[type="submit"]').click();
      cy.contains('[role="alert"]', 'ya está registrado');
      cy.location('pathname').should('eq', '/register');
    });
  });

  describe('Logout', () => {
    it('cierra la sesión, limpia el JWT y vuelve al inicio', () => {
      cy.loginAs(CLIENT);
      cy.visit('/');
      cy.contains('header button', 'Cerrar sesión').click();

      cy.location('pathname').should('eq', '/');
      cy.contains('header a', 'Iniciar sesión');
      cy.getCookie(TOKEN_KEY).should('not.exist');
      cy.window().its('localStorage').invoke('getItem', TOKEN_KEY).should('be.null');
    });
  });
});
