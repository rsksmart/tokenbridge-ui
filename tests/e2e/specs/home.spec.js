// https://docs.cypress.io/api/introduction/api.html

describe('App is alive', () => {
  it('Allows the user to connect to a wallet', () => {
    cy.visit('/')
    cy.get('#logIn').contains('Connect wallet')
  })
})
