import Dexie from 'dexie'

const dbInstance = new Dexie(process.env.VUE_APP_OFFLINE_DB || 'tknbrgoff')
dbInstance.version(2).stores({
  transactions: `transactionHash, accountAddress, currentStep, type, networkId, tokenFrom, tokenTo, amount, receiveAmount, senderAddress, receiverAddress, timestamp, transactionIndex, blockHash, blockNumber, cumulativeGasUsed, gasUsed, contractAddress, logs, from, to, status, logsBloom, effectiveGasPrice`,
})

export default dbInstance
