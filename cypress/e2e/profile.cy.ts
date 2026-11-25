import { ADMIN, RegisteredUser } from '../support/commands';

describe('Perfil del usuario (/profile)', () => {
  let user: RegisteredUser;

  beforeEach(() => {
    cy.registerUser('perfil').then((registered) => {
      user = registered;
      cy.loginAs(registered);
      cy.visit('/profile');
    });
  });

  it('muestra los datos de la cuenta', () => {
    cy.get('[data-testid="profile-email-value"]').should('contain', user.email);
    cy.get('[data-testid="profile-summary"]').within(() => {
      cy.get('[data-testid="role-badge"]').should('contain', 'CLIENT');
    });
  });

  describe('Cambiar correo', () => {
    it('valida formato y que sea distinto al actual', () => {
      cy.get('#profile-email').clear().type('no-es-un-correo');
      cy.get('[data-testid="profile-email-submit"]').click();
      cy.get('[data-testid="profile-email-error"]').should('contain', 'correo electrónico válido');

      cy.get('#profile-email').clear().type(user.email);
      cy.get('[data-testid="profile-email-submit"]').click();
      cy.get('[data-testid="profile-email-error"]').should('contain', 'ya es tu correo actual');
    });

    it('rechaza un correo que usa otra cuenta (409)', () => {
      cy.get('#profile-email').clear().type(ADMIN.email);
      cy.get('[data-testid="profile-email-submit"]').click();
      cy.get('[data-testid="profile-email-error"]').should(
        'contain',
        'otra cuenta',
      );
    });

    it('actualiza el correo, el encabezado y se conserva al recargar', () => {
      const newEmail = `nuevo_${Date.now()}@store.com`;
      cy.get('#profile-email').clear().type(newEmail);
      cy.get('[data-testid="profile-email-submit"]').click();

      cy.contains('Correo actualizado');
      cy.get('[data-testid="profile-email-value"]').should('contain', newEmail);
      cy.contains('header', newEmail);

      // Al recargar se valida el token con /auth/profile y el correo nuevo sigue.
      cy.reload();
      cy.contains('header', newEmail);
      cy.get('[data-testid="profile-email-value"]').should('contain', newEmail);
    });
  });

  describe('Cambiar contraseña', () => {
    const fill = (current: string, next: string, confirm: string) => {
      cy.get('#profile-current-password').clear().type(current, { log: false });
      cy.get('#profile-new-password').clear().type(next, { log: false });
      cy.get('#profile-confirm-password').clear().type(confirm, { log: false });
      cy.get('[data-testid="profile-password-submit"]').click();
    };

    it('valida las reglas antes de llamar al backend', () => {
      fill('Password123', 'corta', 'corta');
      cy.get('[data-testid="profile-password-error"]').should('contain', 'al menos 8');

      fill('Password123', 'sinmayuscula1', 'sinmayuscula1');
      cy.get('[data-testid="profile-password-error"]').should('contain', 'mayúscula');

      fill('Password123', 'NuevaPass456', 'OtraPass789');
      cy.get('[data-testid="profile-password-error"]').should('contain', 'no coinciden');

      fill('Password123', 'Password123', 'Password123');
      cy.get('[data-testid="profile-password-error"]').should('contain', 'diferente');
    });

    it('muestra el error del backend si la contraseña actual es incorrecta', () => {
      fill('Incorrecta1', 'NuevaPass456', 'NuevaPass456');
      cy.get('[data-testid="profile-password-error"]').should(
        'contain',
        'contraseña actual es incorrecta',
      );
    });

    it('cambia la contraseña: la nueva funciona y la anterior ya no', () => {
      fill('Password123', 'NuevaPass456', 'NuevaPass456');
      cy.contains('Contraseña actualizada');

      cy.request({
        method: 'POST',
        url: `${Cypress.env('apiUrl')}/auth/login`,
        body: { email: user.email, password: 'NuevaPass456' },
      })
        .its('status')
        .should('eq', 200);
      cy.request({
        method: 'POST',
        url: `${Cypress.env('apiUrl')}/auth/login`,
        body: { email: user.email, password: 'Password123' },
        failOnStatusCode: false,
      })
        .its('status')
        .should('eq', 401);
    });
  });
});
