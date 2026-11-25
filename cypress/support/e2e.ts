import './commands';

// Garantiza los usuarios admin/client antes de cada archivo de pruebas.
before(() => {
  cy.seed();
});
