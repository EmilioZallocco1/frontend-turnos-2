describe('Panel de administración', () => {

  beforeEach(() => {
    cy.loginComoAdmin();
  });

  // ------------------------------------------------------
  // 1) Verifica que el panel admin aparece correctamente
  // ------------------------------------------------------
  it('muestra el panel de administración al loguearse como admin', () => {
    cy.get('[data-cy=home-admin-section]').should('be.visible');
    cy.get('[data-cy=admin-titulo]').should('contain.text', 'Panel de administración');
  });

  // ------------------------------------------------------
  // 2) Navegación a Cargar Médico
  // ------------------------------------------------------
  it('permite navegar a la pantalla "Cargar Médico"', () => {
    cy.get('[data-cy=btn-cargar-medico]').click();
    cy.url().should('include', '/admin/medicos');
  });

  // ------------------------------------------------------
  // 3) Navegación a Cargar Obra Social
  // ------------------------------------------------------
  it('permite navegar a la pantalla "Cargar Obra Social"', () => {
    cy.get('[data-cy=btn-cargar-obra-social]').click();
    cy.url().should('include', '/admin/obras-sociales/nueva');
  });

  // ------------------------------------------------------
  // 4) Navegación a la lista de médicos
  // ------------------------------------------------------
  it('permite navegar a la lista de médicos', () => {
    cy.get('[data-cy=btn-ver-medicos]').click();
    cy.url().should('include', '/lista-medicos');
  });

  // ------------------------------------------------------
  // 5) Ver turnos por médico
  // ------------------------------------------------------
  it('permite seleccionar un médico y ver sus turnos (si hay)', () => {
    cy.get('[data-cy=select-medico]').should('exist');

    cy.get('[data-cy=select-medico]').then(($select) => {
      const options = $select.find('option');
      const hasMedicos = options.length > 1;

      if (hasMedicos) {
        cy.get('[data-cy=select-medico]').select(1);
        cy.get('[data-cy=btn-ver-turnos-medico]').click();

        cy.get('[data-cy=admin-resultados]').should('be.visible');

        cy.get('[data-cy=admin-turno-card]').then(($cards) => {
          if ($cards.length > 0) {
            cy.wrap($cards.first()).should('contain.text', 'Médico');
          } else {
            cy.contains('No se encontraron resultados.').should('be.visible');
          }
        });
      } else {
        cy.log('No hay médicos cargados, se omite la validación de turnos.');
      }
    });
  });

  // ------------------------------------------------------
  // 6) Cargar un médico desde el formulario de admin
  // ------------------------------------------------------
 it('permite cargar un médico desde la pantalla de admin', () => {
  // 1) Ir a la pantalla Cargar Médico
  cy.get('[data-cy=btn-cargar-medico]').click();
  cy.url().should('include', '/admin/medicos');

  const timestamp = Date.now();

  // 2) Completar formulario
  cy.get('[data-cy=input-medico-nombre]').type('Medico Cypress ' + timestamp);
  cy.get('[data-cy=input-medico-email]').type(`medico.${timestamp}@test.com`);
  cy.get('[data-cy=input-medico-telefono]').type('+54 11 5555-5555');

  // 3) Especialidad → es un select
  cy.get('[data-cy=select-medico-especialidad]').select(1);

  // 4) Obra social (opcional)
  // cy.get('[data-cy=select-medico-obra-social]').select(1);

  // 5) Guardar
  cy.get('[data-cy=btn-guardar-medico]').click();

  // 6) Verificar que se guardó
  cy.contains('Médico registrado exitosamente').should('exist');
});


});
