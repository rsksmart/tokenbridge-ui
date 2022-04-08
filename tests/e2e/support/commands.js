// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//

// -- This is a parent command --
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
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
