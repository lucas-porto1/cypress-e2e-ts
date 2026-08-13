interface FormOptions {
  dropdown: {
    value: string;
    label: string;
  };
}

describe('Form controls', () => {
  it('selects and clears checkboxes', () => {
    cy.visit('/checkboxes');

    cy.get('#checkboxes input').first().check();
    cy.get('#checkboxes input').first().should('be.checked');
    cy.get('#checkboxes input').last().uncheck();
    cy.get('#checkboxes input').last().should('not.be.checked');
  });

  it('selects a dropdown option using fixture data', () => {
    cy.fixture<FormOptions>('form-options').then(({ dropdown }) => {
      cy.visit('/dropdown');
      cy.get('#dropdown').select(dropdown.value);
      cy.get('#dropdown').should('have.value', dropdown.value);
      cy.get('#dropdown option:selected').should('have.text', dropdown.label);
    });
  });
});
