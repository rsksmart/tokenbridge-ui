import Transaction from '@/modules/transactions/transaction'
import { TransactionService } from '@/modules/transactions/transactions.service'
import ERC20_ABI from '@/constants/abis/erc20.json'
import BRIDGE_ABI from '@/constants/abis/bridge.json'
import { ESTIMATED_GAS_AVG } from '@/constants/transactions'
import * as methodType from '@/constants/methodType'
import { MAX_UINT256, retry3Times } from '@/utils'
import BigNumber from 'bignumber.js'
import { TOKEN_TYPE_ERC_20 } from '@/constants/tokenType'
import NFT_BRIDGE from '@/constants/abis/nft-bridge.json'

class ERC20TokenTransaction extends Transaction {
  /**
   * Approve
   * @param {string} tokenAddress
   * @param {TransactionObject} transactionObject
   * @returns {Promise<unknown>}
   */
  async approve(tokenAddress, transactionObject) {
    const gasPrice = await this.getGasPriceHex()
    return new Promise((resolve, reject) => {
      const tokenContract = new this.web3.eth.Contract(ERC20_ABI, tokenAddress)
      tokenContract.methods
        .approve(this.config.bridge, MAX_UINT256)
        .send({ ...transactionObject, gasPrice }, this.callback({ resolve, reject }))
    })
  }

  depositTo(receiverAddress, transactionObject) {
    return new Promise((resolve, reject) => {
      const bridgeContract = new this.web3.eth.Contract(BRIDGE_ABI, this.config.bridge)
      bridgeContract.methods
        .depositTo(receiverAddress)
        .send(transactionObject, this.callback({ resolve, reject }))
    })
  }

  receiveTokensTo({ tokenToUse, to, amount }, transactionObject) {
    return new Promise((resolve, reject) => {
      const bridgeContract = new this.web3.eth.Contract(BRIDGE_ABI, this.config.bridge)
      bridgeContract.methods
        .receiveTokensTo(tokenToUse, to, amount)
        .send(transactionObject, this.callback({ resolve, reject }))
    })
  }

  async saveTransaction(receipt, token, amount, receiveAmount, senderAddress, receiverAddress) {
    const transactionBody = {
      type: 'Cross',
      networkId: this.config.networkId,
      tokenFrom: token.symbol,
      tokenTo: token.receiveToken.symbol,
      amount,
      receiveAmount,
      senderAddress,
      receiverAddress,
      timestamp: Date.now(),
      accountsAddresses: [senderAddress.toLowerCase()],
      tokenType: TOKEN_TYPE_ERC_20,
      ...receipt,
    }
    if (senderAddress.toLowerCase() !== receiverAddress.toLowerCase()) {
      transactionBody.accountsAddresses.push(receiverAddress.toLowerCase())
    }
    const transactionService = new TransactionService()
    return transactionService.saveTransaction(transactionBody)
  }

  async cross(amount, receiveAmount, token, accountAddress, receiverAddress) {
    const { decimals, address } = token
    const amountWithDecimals = new BigNumber(amount).shiftedBy(decimals).toFixed(0)

    const gasPrice = await this.getGasPriceHex()
    let receipt = null
    switch (token.methodType) {
      case methodType.DEPOSITOR:
        receipt = await this.depositTo(receiverAddress, {
          from: accountAddress,
          gasPrice,
          gas: ESTIMATED_GAS_AVG,
          value: amountWithDecimals,
        })
        break
      default:
        receipt = await this.receiveTokensTo(
          {
            tokenToUse: address,
            to: receiverAddress,
            amount: amountWithDecimals,
          },
          { from: accountAddress, gasPrice, gas: ESTIMATED_GAS_AVG },
        )
    }
    if (!receipt) {
      throw new Error('Failed to recover receipt information')
    }
    return this.saveTransaction(
      receipt,
      token,
      amount,
      receiveAmount,
      accountAddress,
      receiverAddress,
    )
  }

  getClaimData(decodedEvent, event) {
    return {
      to: decodedEvent._to,
      amount: decodedEvent._amount,
      blockHash: event.blockHash,
      transactionHash: event.transactionHash,
      logIndex: event.logIndex,
    }
  }

  async claim(claimData, transactionObject) {
    const gasPrice = await this.getGasPriceHex()
    return new Promise((resolve, reject) => {
      const bridgeContract = new this.web3.eth.Contract(BRIDGE_ABI, this.config.bridge)
      bridgeContract.methods
        .claim(claimData)
        .send({ ...transactionObject, gasPrice }, this.callback({ resolve, reject }))
    })
  }

  transactionDataHashes(transactionHash, toNetwork) {
    const bridgeContract = new this.web3.eth.Contract(BRIDGE_ABI, toNetwork.bridge)
    return retry3Times(bridgeContract.methods.transactionsDataHashes(transactionHash).call)
  }

  claimed(transactionDataHash, toNetwork) {
    const bridgeContract = new this.web3.eth.Contract(BRIDGE_ABI, toNetwork.bridge)
    return retry3Times(bridgeContract.methods.claimed(transactionDataHash).call)
  }
}

export default ERC20TokenTransaction
