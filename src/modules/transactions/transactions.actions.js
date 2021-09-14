import BigNumber from 'bignumber.js'
import BRIDGE_ABI from '@/constants/abis/bridge.json'
import { waitForReceipt } from '@/utils'
import { ESTIMATED_GAS_AVG } from '@/constants/transactions'
import Web3 from 'web3'
import * as methodType from '@/constants/methodType'
/**
 * Global types
 * -
 * Transaction Object
 * @typedef {Object} TransactionObject
 * @property {String|Number} from
 * @property {String=} to
 * @property {Number|String|BN|BigNumber=} value
 * @property {Number=} gas
 * @property {Number|String|BN|BigNumber=} gasPrice
 * @property {String=} data
 * @property {Number=} nonce
 * @property {String=} chain
 * @property {String=} hardfork
 * @property {Object=} common
 */

/**
 * Transaction Callback
 * @param web3
 * @param {function(String): String} txExplorerLink
 * @param {Object} promiseParams
 * @param {function(*=): void} promiseParams.resolve
 * @param {function(*=): void} promiseParams.reject
 * @returns {(function(*=, *=): Promise<*|undefined>)|*}
 */
const transactionCallback = (web3, txExplorerLink, { resolve, reject }) => async (err, txHash) => {
  const textExplorerLink = txExplorerLink(txHash)
  if (err) {
    return reject(new Error(`Execution failed ${err?.message} ${textExplorerLink}`))
  }
  try {
    const receipt = await waitForReceipt(txHash, web3)
    if (receipt.status) {
      return resolve(receipt)
    } else {
      return reject(new Error(`Transaction status failed ${err?.message} ${textExplorerLink}`))
    }
  } catch (error) {
    return reject(new Error(`${error} ${textExplorerLink}`))
  }
}

/**
 * Receive Tokens To
 * @param {Object} connectionSettings
 * @param {Object} connectionSettings.config
 * @param {import("web3") as Web3} connectionSettings.web3
 * @param {Object} methodParams
 * @param {String} methodParams.address
 * @param {String} methodParams.receiverAddress
 * @param {String} methodParams.amountWithDecimals
 * @param {function(String): String} methodParams.txExplorerLink
 * @param {TransactionObject} transactionObject
 * @returns {Promise<unknown>}
 */
export const receiveTokensTo = (
  { config, web3 },
  { address, receiverAddress, amountWithDecimals, txExplorerLink },
  transactionObject,
) =>
  new Promise((resolve, reject) => {
    const bridgeContract = new web3.eth.Contract(BRIDGE_ABI, config.bridge)
    bridgeContract.methods
      .receiveTokensTo(address, receiverAddress, amountWithDecimals)
      .send(transactionObject, transactionCallback(web3, txExplorerLink, { resolve, reject }))
  })

export const depositTo = (
  { config, web3 },
  { receiverAddress, txExplorerLink },
  transactionObject,
) =>
  new Promise((resolve, reject) => {
    const bridgeContract = new web3.eth.Contract(BRIDGE_ABI, config.bridge)
    bridgeContract.methods
      .depositTo(receiverAddress)
      .send(transactionObject, transactionCallback(web3, txExplorerLink, { resolve, reject }))
  })

export const claim = (
  { config, web3 },
  { to, amount, blockHash, transactionHash, logIndex, txExplorerLink },
  transactionObject,
) =>
  new Promise((resolve, reject) => {
    const bridgeContract = new web3.eth.Contract(BRIDGE_ABI, config.bridge)
    bridgeContract.methods
      .claim({ to, amount, blockHash, transactionHash, logIndex })
      .send(transactionObject, transactionCallback(web3, txExplorerLink, { resolve, reject }))
  })
/**
 * CrossToken Call
 * @param {Web3} web3
 * @param {Object} config
 * @returns {function(*=, *, {getGasPriceHex: *}, *): Promise<*>}
 */
export const crossToken = (web3, config) => {
  return async (amount, token, { getGasPriceHex }, settings) => {
    const { decimals, address } = token
    const { txExplorerLink, receiverAddress, accountAddress } = settings
    const amountWithDecimals = new BigNumber(amount).shiftedBy(decimals).toFixed(0)

    const gasPrice = await getGasPriceHex()

    if (token.methodType === methodType.DEPOSITOR) {
      return depositTo(
        { config, web3 },
        { receiverAddress, txExplorerLink },
        {
          from: accountAddress,
          gasPrice: gasPrice,
          gas: ESTIMATED_GAS_AVG,
          value: amountWithDecimals,
        },
      )
    }

    return receiveTokensTo(
      { config, web3 },
      { address, receiverAddress, amountWithDecimals, txExplorerLink },
      { from: accountAddress, gasPrice: gasPrice, gas: ESTIMATED_GAS_AVG },
    )
  }
}
