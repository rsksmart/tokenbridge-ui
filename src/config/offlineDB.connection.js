import Dexie from 'dexie'

const DB_DEFAULT_NAME = 'tknbrgoff'

const dbInstance = new Dexie(process.env.VUE_APP_OFFLINE_DB || DB_DEFAULT_NAME)
dbInstance.version(2).stores({
  transactions: `transactionHash, *accountsAddresses, networkId, timestamp, blockNumber, receiveAmount, currentStep, type, senderAddress, receiverAddress`,
})

export default dbInstance
