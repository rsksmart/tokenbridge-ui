// https://docs.cypress.io/api/introduction/api.html

describe('App is alive', () => {
  it('Connect wallet button should be present', async () => {
    cy.visit('/')
    cy.get('#logIn').contains('Connect wallet')
  })
})
