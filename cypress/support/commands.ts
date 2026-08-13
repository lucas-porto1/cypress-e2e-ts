declare global {
  namespace Cypress {
    interface Chainable {
      login(): Chainable<void>;
      visitLoginPage(): Chainable<void>;
      submitLoginForm(username: string, password: string): Chainable<void>;
    }
  }
}

Cypress.Commands.add('login', () => {
  cy.env(['STANDARD_USER', 'USER_PASSWORD'], { log: false }).then(
    ({ STANDARD_USER: username, USER_PASSWORD: password }) => {
      if (typeof username !== 'string' || typeof password !== 'string') {
        throw new Error('STANDARD_USER and USER_PASSWORD must be configured.');
      }

      cy.session(
        ['programmatic-login', username],
        () => {
          cy.request({
            method: 'POST',
            url: '/authenticate',
            form: true,
            body: { username, password },
            followRedirect: false,
            log: false,
          })
            .its('status')
            .should('eq', 303);
        },
        {
          cacheAcrossSpecs: true,
          validate() {
            cy.request({ url: '/secure', followRedirect: false }).its('status').should('eq', 200);
          },
        },
      );
    },
  );
});

Cypress.Commands.add('visitLoginPage', () => {
  cy.visit('/login');
});

Cypress.Commands.add('submitLoginForm', (username, password) => {
  cy.get('#username').type(username);
  cy.get('#password').type(password, { log: false });
  cy.get('button[type="submit"]').click();
});

export {};
