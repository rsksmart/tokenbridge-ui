import Transaction from '@/modules/transactions/transaction'
import SIDE_NFT_TOKEN from '@/constants/abis/side_nft_token.json'
import NFT_BRIDGE from '@/constants/abis/nft-bridge.json'
import { TOKEN_TYPE_ERC_721 } from '@/constants/tokenType'
import { TransactionService } from '@/modules/transactions/transactions.service'
import { retry3Times } from '@/utils'

class ERC721NFTTransaction extends Transaction {
  sideConfig = null

  constructor({ web3, config, sideConfig }) {
    super({ web3, config })
    this.sideConfig = sideConfig
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
      ...receipt,
    }
    const transactionService = new TransactionService()
    return transactionService.saveTransaction(transactionBody)
  }

  receiveTokensTo({ tokenAddress, to, tokenId }, transactionObject) {
    return new Promise((resolve, reject) => {
      const bridgeContract = new this.web3.eth.Contract(NFT_BRIDGE, this.sideConfig.nftBridge)
      bridgeContract.methods
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
    }

    return this.saveTransaction(receipt, tokenId, tokenAddress, to)
  }

  async claim(claimData, transactionObject) {
    const gasPrice = await this.getGasPriceHex()
    return new Promise((resolve, reject) => {
      const nftContractAddress = new this.web3.eth.Contract(NFT_BRIDGE, this.sideConfig.nftBridge)
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
