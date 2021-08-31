import Dexie from 'dexie'

const DB_DEFAULT_NAME = 'tknbrgoff'

const dbInstance = new Dexie(process.env.VUE_APP_OFFLINE_DB || DB_DEFAULT_NAME)
dbInstance.version(2).stores({
  transactions: `transactionHash, [accountAddress+networkId], currentStep, type, tokenFrom, tokenTo, amount, receiveAmount, senderAddress, receiverAddress, timestamp, blockNumber`,
})

export default dbInstance
