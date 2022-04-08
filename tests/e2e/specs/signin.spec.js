import { MAIN_NETWORK_SELECT_TEXT, SIDE_NETWORK_SELECT_TEXT } from '../pages/home'

describe('Wallet should be alive', () => {
  it('Allows the user to connect to a wallet', () => {
    cy.connectWallet()
      .get(MAIN_NETWORK_SELECT_TEXT)
      .should('contains.text', 'Kovan')
      .get(SIDE_NETWORK_SELECT_TEXT)
      .should('contains.text', 'RSK Testnet')
  })
})
