export const TOKEN_KEY = 'gamestore_jwt_token';
export const USER_KEY = 'gamestore_auth_user';

export interface Credentials {
  email: string;
  password: string;
}

export interface ApiSession {
  accessToken: string;
  user: { id: string; email: string; role: 'admin' | 'client' };
}

export interface RegisteredUser extends Credentials {
  id: string;
  accessToken: string;
}

// Usuarios creados por el seed del backend (POST /seed).
export const ADMIN: Credentials = {
  email: 'admin@store.com',
  password: 'admin',
};
export const CLIENT: Credentials = {
  email: 'client@store.com',
  password: 'client',
};

const apiUrl = () => Cypress.expose('apiUrl') as string;

/** JWT sin firma válida: sirve para probar el proxy y el rechazo del backend. */
export function fakeJwt(payload: Record<string, unknown>): string {
  const encode = (value: object) =>
    btoa(JSON.stringify(value))
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
  return `${encode({ alg: 'HS256', typ: 'JWT' })}.${encode(payload)}.firma-falsa`;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      /** Ejecuta POST /seed para tener admin@store.com y client@store.com. */
      seed(): Chainable<void>;
      /** Login directo contra la API (no usa la interfaz). */
      apiLogin(credentials: Credentials): Chainable<ApiSession>;
      /** Crea un cliente nuevo y único vía API. */
      registerUser(prefix?: string): Chainable<RegisteredUser>;
      /** Inicia sesión como el usuario dado y deja listas la cookie y el localStorage. */
      loginAs(credentials: Credentials): Chainable<void>;
    }
  }
}

Cypress.Commands.add('seed', () => {
  cy.request({
    method: 'POST',
    url: `${apiUrl()}/seed`,
    failOnStatusCode: false,
  }).then(() => undefined);
});

Cypress.Commands.add('apiLogin', (credentials: Credentials) => {
  return cy
    .request('POST', `${apiUrl()}/auth/login`, credentials)
    .then((res) => res.body as ApiSession);
});

Cypress.Commands.add('registerUser', (prefix = 'cy') => {
  const email = `${prefix}_${Date.now()}_${Math.floor(Math.random() * 1e4)}@store.com`;
  const password = 'Password123';
  return cy
    .request('POST', `${apiUrl()}/auth/register`, { email, password })
    .then((res) => ({
      email,
      password,
      id: res.body.user.id as string,
      accessToken: res.body.accessToken as string,
    }));
});

Cypress.Commands.add('loginAs', (credentials: Credentials) => {
  cy.session(
    ['session', credentials.email],
    () => {
      cy.apiLogin(credentials).then(({ accessToken, user }) => {
        // Replica lo que hace tokenStorage.setToken / setUser en la app.
        cy.setCookie(TOKEN_KEY, accessToken);
        cy.visit('/');
        cy.window().then((win) => {
          win.localStorage.setItem(TOKEN_KEY, accessToken);
          win.localStorage.setItem(USER_KEY, JSON.stringify(user));
        });
      });
    },
    {
      validate() {
        cy.getCookie(TOKEN_KEY).should('exist');
      },
    },
  );
});
