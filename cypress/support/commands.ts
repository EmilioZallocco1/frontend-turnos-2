//  Esto marca el archivo como módulo y permite augmentar el namespace global
export {};

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Hace login como un paciente de prueba y verifica que llegue a /home
       */
      loginComoPaciente(): Chainable<void>;

      /**
       * Hace login como un administrador de prueba
       */
      loginComoAdmin(): Chainable<void>;
    }
  }
}

//  Implementación real del comando
Cypress.Commands.add('loginComoPaciente', () => {
  //  Usa un usuario REAL que tengas en tu backend
  const email = 'paciente@test.com';
  const password = '123456';

  cy.visit('/login');

  cy.get('[data-cy=login-email]').clear().type(email);
  cy.get('[data-cy=login-password]').clear().type(password);
  cy.get('[data-cy=login-submit]').click();

  // Esperar la redirección al home
  cy.url().should('include', '/home');
});

// ------------------------------
// loginComoAdmin
// ------------------------------
Cypress.Commands.add('loginComoAdmin', () => {
  const email = 'admin@clinica.com';      // 
  const password = '123456';         // 
  cy.visit('/login');

  cy.get('[data-cy=login-email]').clear().type(email);
  cy.get('[data-cy=login-password]').clear().type(password);
  cy.get('[data-cy=login-submit]').click();

  // Esperar el home
  cy.url().should('include', '/home');

  // Y que el panel admin esté visible
  cy.get('[data-cy=home-admin-section]').should('be.visible');
});
