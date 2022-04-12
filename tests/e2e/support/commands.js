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
    .wait(1000)
    .task('switchMetamaskPopup')
    .then((page) => {
      if (page) {
        return cy.task('acceptMetamaskAccess').get(METAMASK_CONFIRM_BUTTON_MODAL_ACCEPT).click()
      } else {
        return cy.get(METAMASK_CONFIRM_BUTTON_MODAL_ACCEPT).click()
      }
    })
})
