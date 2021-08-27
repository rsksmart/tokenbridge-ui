import Dexie from 'dexie'

const DB_DEFAULT_NAME = 'tknbrgoff'

const dbInstance = new Dexie(process.env.VUE_APP_OFFLINE_DB || DB_DEFAULT_NAME)
dbInstance.version(2).stores({
  transactions: `transactionHash, accountAddress, currentStep, type, networkId, tokenFrom, tokenTo, amount, receiveAmount, senderAddress, receiverAddress, timestamp, transactionIndex, blockHash, blockNumber, cumulativeGasUsed, gasUsed, contractAddress, logs, from, to, status, logsBloom, effectiveGasPrice`,
})

export default dbInstance
