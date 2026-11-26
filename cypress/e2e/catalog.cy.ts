import { CLIENT } from '../support/commands';

describe('Catálogo: filtros, paginación y detalle de juego', () => {
  before(() => {
    cy.seed();
  });

  it('pide iniciar sesión si el visitante no está autenticado', () => {
    cy.visit('/');
    cy.contains('Inicia sesión para consultar el catálogo protegido por JWT.');
  });

  describe('Usuario autenticado', () => {
    beforeEach(() => {
      cy.loginAs(CLIENT);
    });

    it('muestra como máximo 6 juegos por página y permite cambiar de página', () => {
      cy.visit('/');
      cy.get('article').should('have.length.at.least', 1).and('have.length.at.most', 6);

      cy.get('nav[aria-label="Paginación"]').then(($nav) => {
        if ($nav.length === 0) return;
        const nextBtn = $nav.find('button:contains("Siguiente")');
        if (!nextBtn.is(':disabled')) {
          cy.contains('nav[aria-label="Paginación"] button', 'Siguiente').click();
          cy.location('search').should('include', 'page=2');
          cy.get('article').should('have.length.at.least', 1).and('have.length.at.most', 6);

          cy.contains('nav[aria-label="Paginación"] button', 'Anterior').click();
          cy.location('search').should('include', 'page=1');
        }
      });
    });

    it('filtra juegos por búsqueda reactiva y permite limpiar filtros', () => {
      cy.visit('/');
      cy.get('article h3 a')
        .first()
        .invoke('text')
        .then((rawTitle) => {
          const keyword = rawTitle.trim().split(/\s+/)[0];
          cy.get('[data-testid="catalog-search"]').clear().type(keyword);
          cy.location('search').should('include', `search=${encodeURIComponent(keyword)}`);
          cy.contains('resultado(s)');
          cy.get('article').should('have.length.at.least', 1);

          cy.contains('[data-testid="catalog-filters"] button', 'Limpiar filtros').click();
          cy.location('search').should('eq', '');
          cy.get('[data-testid="catalog-search"]').should('have.value', '');
        });
    });

    it('filtra juegos por categoría desde el selector', () => {
      cy.visit('/');
      cy.get('[data-testid="catalog-category"] option').should('have.length.at.least', 2);
      cy.get('[data-testid="catalog-category"] option')
        .eq(1)
        .invoke('val')
        .then((categoryId) => {
          const id = String(categoryId);
          cy.get('[data-testid="catalog-category"]').select(id);
          cy.location('search').should('include', `categoryId=${id}`);
        });
    });

    it('navega al detalle de un videojuego al hacer clic en su título', () => {
      cy.visit('/');
      cy.get('article h3 a')
        .first()
        .then(($link) => {
          const title = $link.text().trim();
          const href = $link.attr('href');
          cy.wrap($link).click();
          cy.location('pathname').should('eq', href);
          cy.contains('h1', title);
        });
    });
  });
});
