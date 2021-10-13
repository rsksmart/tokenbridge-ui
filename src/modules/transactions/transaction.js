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
      const textExplorerLink = txExplorerLink(txHash, this.config.explorer)
      if (err) {
        return reject(new Error(`Execution failed ${err?.message} ${textExplorerLink}`))
      }
      try {
        const receipt = await waitForReceipt(txHash, this.web3)
        if (receipt.status) {
          return resolve(receipt)
        } else {
          const stringReceipt = JSON.stringify(receipt, null, 2)
          return reject(
            new Error(
              `Transaction status failed ${textExplorerLink}
                <p class="d-none">
                  <small>Transaction Info</small>
                  <pre class="overflow-auto d-none" style="max-height: 200px">${stringReceipt}</pre>
                </p>
              `,
            ),
          )
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
    throw new Error('Method not implemented yet')
  }
  async claim() {
    throw new Error('Method not implemented yet')
  }
  async cross() {
    throw new Error('Method not implemented yet')
  }
  transactionDataHashes() {
    throw new Error('Method not implemented yet')
  }
}

export default Transaction
