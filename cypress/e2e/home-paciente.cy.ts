describe('Home Paciente - navegación básica', () => {
  beforeEach(() => {
    cy.loginComoPaciente();   // 👈 hace login
    cy.visit('/home');        // y luego va al home
  });

  it('muestra la sección de paciente y los botones principales', () => {
    cy.get('[data-cy=home-paciente-section]').should('be.visible');

    cy.get('[data-cy=btn-solicitar-turno]').should('be.visible');
    cy.get('[data-cy=btn-ver-mis-turnos]').should('be.visible');
    cy.get('[data-cy=btn-mi-perfil]').should('be.visible');
  });

  it('permite ir a Solicitar Turno', () => {
    cy.get('[data-cy=btn-solicitar-turno]').click();
    cy.url().should('include', '/turno-form');
  });

  it('permite ir a Ver Mis Turnos', () => {
    cy.get('[data-cy=btn-ver-mis-turnos]').click();
    cy.url().should('include', '/listaTurnos');
  });

  it('permite ir a Mi Perfil', () => {
    cy.get('[data-cy=btn-mi-perfil]').click();
    cy.url().should('include', '/perfil');
  });
});
