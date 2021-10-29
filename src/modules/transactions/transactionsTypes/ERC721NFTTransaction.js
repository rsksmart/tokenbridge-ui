import Transaction from '@/modules/transactions/transaction'
import SIDE_NFT_TOKEN from '@/constants/abis/side_nft_token.json'
import NFT_BRIDGE from '@/constants/abis/nft-bridge.json'
import { TOKEN_TYPE_ERC_721 } from '@/constants/tokenType'
import { TransactionService } from '@/modules/transactions/transactions.service'
import { retry3Times } from '@/utils'

class ERC721NFTTransaction extends Transaction {
  static getParamsForGetTransactionId(decodedEvent, event) {
    return [
      decodedEvent._originalTokenAddress,
      decodedEvent._from,
      decodedEvent._to,
      decodedEvent._tokenId,
      event.blockHash,
      event.transactionHash,
      event.logIndex,
    ]
  }
  async approve(nftContractAddress, transactionObject) {
    const gasPrice = await this.getGasPriceHex()
    return new Promise((resolve, reject) => {
      const tokenContract = new this.web3.eth.Contract(SIDE_NFT_TOKEN, nftContractAddress)
      tokenContract.methods
        .setApprovalForAll(this.config.nftBridge, true)
        .send({ ...transactionObject, gasPrice }, this.callback({ resolve, reject }))
    })
  }

  async saveTransaction(receipt, tokenId, senderAddress, receiverAddress) {
    const transactionBody = {
      type: 'NFT',
      networkId: this.config.networkId,
      tokenId,
      senderAddress,
      receiverAddress,
      timestamp: Date.now(),
      tokenType: TOKEN_TYPE_ERC_721,
      accountsAddresses: [senderAddress.toLowerCase(), receiverAddress.toLowerCase()],
      destinationChainId: this.config.crossToNetwork.networkId,
      ...receipt,
    }
    const transactionService = new TransactionService()
    return transactionService.saveTransaction(transactionBody)
  }

  async receiveTokensTo({ tokenAddress, to, tokenId }, transactionObject) {
    const nftBridgeContract = new this.web3.eth.Contract(NFT_BRIDGE, this.config.nftBridge)

    return new Promise((resolve, reject) => {
      nftBridgeContract.methods
        .receiveTokensTo(tokenAddress, to, tokenId)
        .send(transactionObject, this.callback({ resolve, reject }))
    })
  }

  async cross(tokenAddress, to, tokenId, transactionObject) {
    const gasPrice = await this.getGasPriceHex()
    const receipt = await this.receiveTokensTo(
      { tokenAddress, to, tokenId },
      { ...transactionObject, gasPrice },
    )
    if (!receipt) {
      throw new Error('Failed to recover receipt information')
    } else {
      console.log('%cTransaction Receipt is: ', 'color: purple; font-weight: bold')
      console.table(receipt)
    }

    return this.saveTransaction(receipt, tokenId, tokenAddress, to)
  }

  /**
   * Get Claim Data method
   * @param {
   *  to: String,
   *  from: String,
   *  _originalTokenAddress: String,
   *  blockHash: bytes32,
   *  transactionHash: bytes32,
   *  logIndex: uint32,
   * }
   * @param {*} event
   * @returns {
   *  to: address payable,
   *  from: address,
   *  tokenId: uint256,
   *  tokenAddress: address,
   *  blockHash: bytes32,
   *  transactionHash: bytes32,
   *  logIndex: uint32,
   * }
   */
  getClaimData(decodedEvent, event) {
    return {
      to: decodedEvent._to,
      from: decodedEvent._from,
      tokenId: decodedEvent._tokenId,
      tokenAddress: decodedEvent._originalTokenAddress,
      blockHash: event.blockHash,
      transactionHash: event.transactionHash,
      logIndex: event.logIndex,
    }
  }

  async claim(claimData, transactionObject) {
    const gasPrice = await this.getGasPriceHex()
    return new Promise((resolve, reject) => {
      const nftContractAddress = new this.web3.eth.Contract(NFT_BRIDGE, this.config.nftBridge)
      nftContractAddress.methods
        .claim(claimData)
        .send({ ...transactionObject, gasPrice }, this.callback({ resolve, reject }))
    })
  }

  transactionDataHashes(transactionHash, toNetwork) {
    const bridgeContract = new this.web3.eth.Contract(NFT_BRIDGE, toNetwork.nftBridge)
    return retry3Times(bridgeContract.methods.transactionDataHashes(transactionHash).call)
  }

  claimed(transactionDataHash, toNetwork) {
    const bridgeContract = new this.web3.eth.Contract(NFT_BRIDGE, toNetwork.nftBridge)
    return retry3Times(bridgeContract.methods.claimed(transactionDataHash).call)
  }
}

export default ERC721NFTTransaction
