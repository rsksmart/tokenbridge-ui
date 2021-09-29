import Transaction from '@/modules/transactions/transaction'
import SIDE_NFT_TOKEN from '@/constants/abis/side_nft_token.json'
import NFT_BRIDGE from '@/constants/abis/nft-bridge.json'

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
      accountsAddresses: [senderAddress.toLowerCase()],
      ...receipt,
    }
    /**
     * TODO: Add action to save the transaction in the DB
     */
    return new Promise(resolve => {
      resolve(transactionBody)
    })
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

    return await this.saveTransaction(receipt, tokenId, tokenAddress, to)
  }

  async claim(claimData, transactionObject) {
    return new Promise((resolve, reject) => {
      const nftContractAddress = new this.web3.eth.Contract(NFT_BRIDGE, this.sideConfig.nftBridge)
      nftContractAddress.methods
        .claim(claimData)
        .send(transactionObject, this.callback({ resolve, reject }))
    })
  }
}

export default ERC721NFTTransaction
