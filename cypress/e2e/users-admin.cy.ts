import { ADMIN, RegisteredUser } from '../support/commands';

const apiUrl = () => Cypress.expose('apiUrl') as string;

describe('Gestión de usuarios y roles (/users)', () => {
  beforeEach(() => {
    cy.loginAs(ADMIN);
  });

  it('lista usuarios con su rol y deshabilita el cambio sobre la propia cuenta', () => {
    cy.visit('/users');
    cy.contains('[data-testid="users-table"] tr', ADMIN.email).within(() => {
      cy.get('[data-testid="role-badge"]').should('contain', 'ADMIN');
    });
    cy.get(`[data-testid="change-role-${ADMIN.email}"]`).should('be.disabled');
  });

  it('filtra por correo', () => {
    cy.registerUser('filtro').then((user: RegisteredUser) => {
      cy.visit('/users');
      cy.get('[data-testid="users-search"]').type(user.email);
      cy.get('[data-testid="users-table"] tbody tr').should('have.length', 1);
      cy.get(`[data-testid="user-row-${user.email}"]`).should('be.visible');
    });
  });

  it('cancelar el diálogo no cambia el rol', () => {
    cy.registerUser('cancelar').then((user: RegisteredUser) => {
      cy.visit('/users');
      cy.get('[data-testid="users-search"]').type(user.email);
      cy.get(`[data-testid="change-role-${user.email}"]`).click();
      cy.get('[data-testid="change-role-dialog"]').should('be.visible');
      cy.contains('[data-testid="change-role-dialog"] button', 'Cancelar').click();
      cy.get('[data-testid="change-role-dialog"]').should('not.be.visible');
      cy.get(`[data-testid="user-row-${user.email}"] [data-testid="role-badge"]`).should(
        'contain',
        'CLIENT',
      );
    });
  });

  it('promueve a un cliente a administrador y notifica', () => {
    cy.registerUser('promover').then((user: RegisteredUser) => {
      cy.visit('/users');
      cy.get('[data-testid="users-search"]').type(user.email);
      cy.get(`[data-testid="change-role-${user.email}"]`).click();
      cy.get('[data-testid="change-role-dialog"]').should('contain', 'users:manage');
      cy.get('[data-testid="confirm-role-change"]').click();

      cy.contains('Rol actualizado');
      cy.get(`[data-testid="user-row-${user.email}"] [data-testid="role-badge"]`).should(
        'contain',
        'ADMIN',
      );

      // Limpieza: se devuelve a client por API.
      cy.apiLogin(ADMIN).then(({ accessToken }) => {
        cy.request({
          method: 'PATCH',
          url: `${apiUrl()}/users/${user.id}/role`,
          auth: { bearer: accessToken },
          body: { role: 'client' },
        })
          .its('status')
          .should('eq', 200);
      });
    });
  });

  it('muestra dentro del diálogo el error que devuelve el backend', () => {
    cy.intercept('PATCH', '**/users/*/role', {
      statusCode: 409,
      body: { message: 'Debe existir al menos un administrador' },
    }).as('changeRole');

    cy.registerUser('error').then((user: RegisteredUser) => {
      cy.visit('/users');
      cy.get('[data-testid="users-search"]').type(user.email);
      cy.get(`[data-testid="change-role-${user.email}"]`).click();
      cy.get('[data-testid="confirm-role-change"]').click();
      cy.wait('@changeRole');
      cy.get('[data-testid="change-role-error"]').should(
        'contain',
        'Debe existir al menos un administrador',
      );
      cy.get('[data-testid="change-role-dialog"]').should('be.visible');
    });
  });
});
