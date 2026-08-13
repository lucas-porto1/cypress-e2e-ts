describe('Dynamic controls', () => {
  it('waits for a control to be removed without a fixed delay', () => {
    cy.visit('/dynamic_controls');

    cy.get('#checkbox').should('be.visible');
    cy.contains('button', 'Remove').click();

    cy.get('#checkbox').should('not.exist');
    cy.get('#message').should('have.text', "It's gone!");
  });
});
