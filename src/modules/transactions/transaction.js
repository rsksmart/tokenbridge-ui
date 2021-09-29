import { waitForReceipt } from '@/utils'
import { txExplorerLink } from '@/utils/text-helpers'

class Transaction {
  web3 = null
  config = null
  constructor({ web3, config }) {
    this.web3 = web3
    this.config = config
  }
  callback({ resolve, reject }) {
    return async (err, txHash) => {
      const textExplorerLink = txExplorerLink(txHash)
      if (err) {
        return reject(new Error(`Execution failed ${err?.message} ${textExplorerLink}`))
      }
      try {
        const receipt = await waitForReceipt(txHash, this.web3)
        if (receipt.status) {
          return resolve(receipt)
        } else {
          return reject(new Error(`Transaction status failed ${err?.message} ${textExplorerLink}`))
        }
      } catch (error) {
        return reject(new Error(`${error} ${textExplorerLink}`))
      }
    }
  }
  async getGasPriceHex() {
    const { networkId } = this.config
    let gasPriceParsed = 0
    if (networkId >= 30 && networkId <= 33) {
      const block = await this.web3.eth.getBlock('latest')
      gasPriceParsed = parseInt(block.minimumGasPrice)
      gasPriceParsed = gasPriceParsed <= 1 ? 1 : gasPriceParsed * 1.03
    } else {
      const gasPriceAvg = await this.web3.eth.getGasPrice()
      gasPriceParsed = parseInt(gasPriceAvg)
      gasPriceParsed = gasPriceParsed <= 1 ? 1 : gasPriceParsed * 1.3
    }
    return `0x${Math.ceil(gasPriceParsed).toString(16)}`
  }
  async approve() {
    throw new Error('You are using a transaction method that require override')
  }
  async claim() {
    throw new Error('You are using a transaction method that require override')
  }
  async cross() {
    throw new Error('You are using a transaction method that require override')
  }
}

export default Transaction
