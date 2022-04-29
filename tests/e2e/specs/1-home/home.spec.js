// https://docs.cypress.io/api/introduction/api.html
import { CONNECT_WALLET_BUTTON } from '../../pages/home'

describe('App is alive', () => {
  it('Connect wallet button should be present', async () => {
    cy.visit('/')
    cy.get(CONNECT_WALLET_BUTTON).contains('Connect wallet')
  })
})
