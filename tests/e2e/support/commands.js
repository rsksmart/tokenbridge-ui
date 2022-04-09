import {
  CONNECT_WALLET_BUTTON,
  METAMASK_CONFIRM_BUTTON_MODAL_ACCEPT,
  METAMASK_OPTION_MODAL_LOGIN,
} from '../pages/home'

Cypress.Commands.add('connectWallet', () => {
  return cy
    .visit('/')
    .get(CONNECT_WALLET_BUTTON)
    .click()
    .get(METAMASK_OPTION_MODAL_LOGIN)
    .children()
    .first()
    .click()
    .get(METAMASK_CONFIRM_BUTTON_MODAL_ACCEPT)
    .click()
})
