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
    cy.visit('/login');
  });

  function submitLogin(username: string, userPassword: string): void {
    cy.get('#username').type(username);
    cy.get('#password').type(userPassword, { log: false });
    cy.get('button[type="submit"]').click();
  }

  it('allows a valid user to sign in', () => {
    submitLogin(standardUser, password);

    cy.location('pathname').should('eq', '/secure');
    cy.get('#flash').should('contain.text', 'You logged into a secure area!');
  });

  it('shows an error for an invalid username', () => {
    submitLogin('invalid_user', password);

    cy.get('#flash').should('be.visible').and('contain.text', 'Your username is invalid!');
  });

  it('shows an error for an invalid password', () => {
    submitLogin(standardUser, 'invalid_password');

    cy.get('#flash').should('be.visible').and('contain.text', 'Your password is invalid!');
  });
});
