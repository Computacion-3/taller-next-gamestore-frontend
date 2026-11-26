import { ADMIN, CLIENT } from '../support/commands';

const apiUrl = () => Cypress.expose('apiUrl') as string;
const MISSING_ID = '00000000-0000-4000-8000-000000000000';

function api(
  method: string,
  path: string,
  token?: string,
  body?: Record<string, unknown>,
) {
  return cy.request({
    method,
    url: `${apiUrl()}${path}`,
    failOnStatusCode: false,
    ...(token && { auth: { bearer: token } }),
    ...(body && { body }),
  });
}

describe('API /users: autorización por rol', () => {
  let adminToken: string;
  let adminId: string;
  let clientToken: string;
  let clientId: string;

  before(() => {
    cy.apiLogin(ADMIN).then(({ accessToken, user }) => {
      adminToken = accessToken;
      adminId = user.id;
    });
    cy.apiLogin(CLIENT).then(({ accessToken, user }) => {
      clientToken = accessToken;
      clientId = user.id;
    });
  });

  it('sin token: 401 en todas las rutas', () => {
    api('GET', '/users').its('status').should('eq', 401);
    api('GET', '/users/me').its('status').should('eq', 401);
    api('PATCH', `/users/${MISSING_ID}/role`, undefined, { role: 'admin' })
      .its('status')
      .should('eq', 401);
  });

  it('cliente: 403 en las rutas de administrador', () => {
    api('GET', '/users', clientToken).its('status').should('eq', 403);
    api('GET', `/users/${adminId}`, clientToken).its('status').should('eq', 403);
    api('PATCH', `/users/${clientId}/role`, clientToken, { role: 'admin' })
      .its('status')
      .should('eq', 403);
  });

  it('cliente: puede ver su perfil y nunca recibe el hash', () => {
    api('GET', '/users/me', clientToken).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.role).to.eq('client');
      expect(res.body).not.to.have.property('passwordHash');
    });
  });

  it('cliente: no puede escalar privilegios desde su perfil (400)', () => {
    api('PATCH', '/users/me', clientToken, { role: 'admin' })
      .its('status')
      .should('eq', 400);
  });

  it('administrador: lista usuarios sin passwordHash', () => {
    api('GET', '/users', adminToken).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.be.an('array').and.not.be.empty;
      res.body.forEach((user: Record<string, unknown>) => {
        expect(user).not.to.have.property('passwordHash');
      });
    });
  });

  it('administrador: valida el id (400) y distingue inexistente (404)', () => {
    api('GET', '/users/no-es-uuid', adminToken).its('status').should('eq', 400);
    api('GET', `/users/${MISSING_ID}`, adminToken).its('status').should('eq', 404);
  });

  it('administrador: no puede quitarse su propio rol (403)', () => {
    api('PATCH', `/users/${adminId}/role`, adminToken, { role: 'client' })
      .its('status')
      .should('eq', 403);
  });

  it('administrador: promueve y degrada a otro usuario', () => {
    cy.registerUser('api_rol').then(({ id }) => {
      api('PATCH', `/users/${id}/role`, adminToken, { role: 'admin' }).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body.role).to.eq('admin');
      });
      api('PATCH', `/users/${id}/role`, adminToken, { role: 'client' }).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body.role).to.eq('client');
      });
    });
  });
});
