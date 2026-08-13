describe('Secure area', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/secure');
  });

  it('restores an authenticated session', () => {
    cy.location('pathname').should('eq', '/secure');
    cy.get('h2').should('contain.text', 'Secure Area');
    cy.get('.subheader').should('contain.text', 'Welcome to the Secure Area');
  });

  it('allows the user to sign out', () => {
    cy.contains('a', 'Logout').click();

    cy.location('pathname').should('eq', '/login');
    cy.get('#flash').should('contain.text', 'You logged out of the secure area!');
  });
});
