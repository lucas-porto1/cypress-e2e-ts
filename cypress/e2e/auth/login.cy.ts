describe('Login', () => {
  let standardUser: string;
  let password: string;

  before(() => {
    cy.env(['STANDARD_USER', 'USER_PASSWORD'], { log: false }).then((environment) => {
      standardUser = environment.STANDARD_USER as string;
      password = environment.USER_PASSWORD as string;
    });
  });

  beforeEach(() => {
    cy.visitLoginPage();
  });

  it('allows a valid user to sign in', () => {
    cy.submitLoginForm(standardUser, password);

    cy.location('pathname').should('eq', '/secure');
    cy.get('#flash').should('contain.text', 'You logged into a secure area!');
  });

  it('shows an error for an invalid username', () => {
    cy.submitLoginForm('invalid_user', password);

    cy.get('#flash').should('be.visible').and('contain.text', 'Your username is invalid!');
  });

  it('shows an error for an invalid password', () => {
    cy.submitLoginForm(standardUser, 'invalid_password');

    cy.get('#flash').should('be.visible').and('contain.text', 'Your password is invalid!');
  });
});
