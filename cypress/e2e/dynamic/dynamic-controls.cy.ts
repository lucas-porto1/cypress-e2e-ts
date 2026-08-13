describe('Dynamic controls', () => {
  it('waits for a control to be removed without a fixed delay', () => {
    cy.intercept('GET', '/dynamic_controls').as('loadControls');
    cy.visit('/dynamic_controls');
    cy.wait('@loadControls').its('response.statusCode').should('eq', 200);

    cy.get('#checkbox').should('be.visible');
    cy.contains('button', 'Remove').click();

    cy.get('#checkbox').should('not.exist');
    cy.get('#message').should('have.text', "It's gone!");
  });
});
