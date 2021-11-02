import Dexie from 'dexie'

const DB_DEFAULT_NAME = 'tknbrgoff'

const dbInstance = new Dexie(process.env.VUE_APP_OFFLINE_DB || DB_DEFAULT_NAME)
/**
 * indexedDB Schema:
 *  - transactionHash: primary key <string>
 *  - accountsAddresses: Array<string>
 *  - networkId: number
 *  - timestamp: number
 *  - blockNumber: number
 *  - receiveAmount: float "It's used only for ERC20 transactions"
 *  - currentStep: number
 *  - type: string "the type of transaction, by default is 'Cross'"
 *  - senderAddress: string
 *  - receiverAddress: string
 *  - tokenId: number "Added on v4 to support ERC721 transactions"
 *  - tokenType: string "Added on v4 to check the kind of transaction"
 *  - destinationChainId: number "Destination Chain ID"
 */
dbInstance.version(5).stores({
  transactions: `transactionHash, *accountsAddresses, networkId, timestamp, blockNumber, receiveAmount, currentStep, type, senderAddress, receiverAddress, tokenId, tokenType, destinationChainId`,
})

export default dbInstance
