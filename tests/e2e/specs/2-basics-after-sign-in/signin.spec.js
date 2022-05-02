import {
  CONNECT_WALLET_BUTTON,
  MAIN_NETWORK_SELECT_TEXT,
  //SIDE_NETWORK_SELECT_TEXT,
} from '../../pages/home'
import { MockProvider } from '@rsksmart/mock-web3-provider'

// eslint-disable-next-line no-undef
describe('Wallet should be alive', () => {

  const address = '0xB98bD7C7f656290071E52D1aA617D9cB4467Fd6D'
  const privateKey = 'de926db3012af759b4f24b5a51ef6afa397f04670f634aa4f48d4480417007f3'

  beforeEach(() => {
    cy.on('window:before:load', (win) => {
      win.ethereum = new MockProvider({
        address,
        privateKey,
        networkVersion: 31,
        debug: true,
      })
    })

    cy.visit('/')
    cy.wait(1000)

    cy.get(CONNECT_WALLET_BUTTON).contains('Connect wallet')
    cy.contains('Connect wallet').click()
    cy.contains('MetaMask').click()
    cy.contains('Confirm').click()
  })

  it('Allows the user to connect to a wallet', () => {
    cy.get(MAIN_NETWORK_SELECT_TEXT).should('contains.text', 'RSK Testnet')
  })
})
