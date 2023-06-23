import Transaction from '@/modules/transactions/transaction'
import { TransactionService } from '@/modules/transactions/transactions.service'
import ERC20_ABI from '@/constants/abis/erc20.json'
import BRIDGE_ABI from '@/constants/abis/bridge_v2.json'
import { ESTIMATED_GAS_AVG } from '@/constants/transactions'
import * as methodType from '@/constants/methodType'
import { MAX_UINT256, retry3Times } from '@/utils'
import BigNumber from 'bignumber.js'
class ERC20TokenTransaction extends Transaction {
  static getParamsForGetTransactionId(decodedEvent, event, originChainId, destinationChainId) {
    return [
      decodedEvent._tokenAddress,
      decodedEvent._from,
      decodedEvent._to,
      decodedEvent._amount,
      event.blockHash,
      event.transactionHash,
      event.logIndex,
      originChainId,
      destinationChainId,
    ]
  }
  /**
   * Approve
   * @param {string} tokenAddress
   * @param {TransactionObject} transactionObject
   * @returns {Promise<unknown>}
   */
  async approve(tokenAddress, transactionObject) {
    // TODO MOVE THIS TO TRANSACTION ACTIONS
    const gasPrice = await this.getGasPriceHex()
    return new Promise((resolve, reject) => {
      const tokenContract = new this.web3.eth.Contract(ERC20_ABI, tokenAddress)
      tokenContract.methods
        .approve(this.config.bridge, MAX_UINT256)
        .send({ ...transactionObject, gasPrice }, this.callback({ resolve, reject }))
    })
  }

  depositTo(destinationChainId, receiverAddress, transactionObject) {
    // TODO MOVE THIS TO TRANSACTION ACTIONS
    return new Promise((resolve, reject) => {
      const bridgeContract = new this.web3.eth.Contract(BRIDGE_ABI, this.config.bridge)
      bridgeContract.methods
        .depositTo(destinationChainId, receiverAddress)
        .send(transactionObject, this.callback({ resolve, reject }))
    })
  }

  async receiveTokensTo({  tokenToUse, to, amount }, transactionObject) {
    // TODO MOVE THIS TO TRANSACTION ACTIONS
    const bridgeContract = new this.web3.eth.Contract(BRIDGE_ABI, this.config.bridge)
    return new Promise((resolve, reject) => {
      bridgeContract.methods
        .receiveTokensTo( tokenToUse, to, amount)
        .send(transactionObject, this.callback({ resolve, reject }))
    })
  }

  async saveTransaction(
    receipt,
    token,
    amount,
    receiveAmount,
    senderAddress,
    receiverAddress,
    timestamp = Date.now(),
  ) {
    const transactionBody = {
      type: 'Cross',
      networkId: this.config.networkId,
      tokenFrom: token.symbol,
      tokenTo: token.receiveToken.symbol,
      amount,
      receiveAmount,
      senderAddress,
      receiverAddress,
      timestamp,
      accountsAddresses: [senderAddress.toLowerCase()],
      tokenType: 'ERC_20',
      destinationChainId: this.config.crossToNetwork.networkId,
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
    const destinationChainId = this.config.crossToNetwork.networkId
    switch (token.methodType) {
      case methodType.DEPOSITOR:
        // TODO MOVE THIS TO TRANSACTION ACTIONS
        receipt = await this.depositTo(destinationChainId, receiverAddress, {
          from: accountAddress,
          gasPrice,
          gas: ESTIMATED_GAS_AVG,
          value: amountWithDecimals,
        })
        break
      default:
        receipt = await this.receiveTokensTo(
          {
            destinationChainId: destinationChainId,
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
      originChainId: parseInt(decodedEvent._originChainId, 10),
      destinationChainId: parseInt(decodedEvent._destinationChainId, 10),
    }
  }

  async claim(claimData, transactionObject) {
    const gasPrice = await this.getGasPriceHex()
    const bridgeContract = new this.web3.eth.Contract(BRIDGE_ABI, this.config.bridge)
    // USE TRANSACTION ACTIONS INSTEAD
    return new Promise((resolve, reject) => {
      bridgeContract.methods
        .claim(claimData)
        .send({ ...transactionObject, gasPrice }, this.callback({ resolve, reject }))
    })
  }

  transactionDataHashes(transactionHash, toNetwork) {
    // MOVE IT TO TRANSACTION ACTIONS
    const bridgeContract = new this.web3.eth.Contract(BRIDGE_ABI, toNetwork.bridge)
    return retry3Times(bridgeContract.methods.transactionsDataHashes(transactionHash).call)
  }

  claimed(transactionDataHash, toNetwork) {
    // MOVE IT TO TRANSACTION ACTIONS
    const bridgeContract = new this.web3.eth.Contract(BRIDGE_ABI, toNetwork.bridge)
    return retry3Times(bridgeContract.methods.claimed(transactionDataHash).call)
  }
}

export default ERC20TokenTransaction
