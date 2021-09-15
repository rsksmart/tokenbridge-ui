import dbInstance from '@/config/offlineDB.connection'
import { TXN_Storage } from '@/utils'

export class TransactionService {
  async synchronizeTransactions(accountAddress = '', networkName = '') {
    if (!TXN_Storage.isStorageAvailable('localStorage')) {
      return
    }
    const transactions = TXN_Storage.getAllTxns4Address(accountAddress, networkName)
    const migratedTransactions = transactions.map(transaction => {
      // Check if empty current step
      transaction.currentStep = transaction.currentStep ?? 0
      // Check if type is empty or old format
      transaction.type = transaction.type === 'Cross Token' ? 'Cross' : transaction.type ?? 'Cross'
      // Check if empty amount
      transaction.receiveAmount = transaction.receiveAmount ?? transaction.amount
      // Check if empty sender
      transaction.senderAddress = transaction.senderAddress ?? transaction.from
      // Check if empty receiver
      transaction.receiverAddress = transaction.receiverAddress ?? transaction.senderAddress
      // Check if its in seconds
      transaction.timestamp =
        transaction.timestamp > 1000000000
          ? transaction.timestamp
          : (transaction.timestamp ?? 0) * 1000
      const accountsAddresses = [transaction.senderAddress.toLowerCase()]
      if (transaction.senderAddress.toLowerCase() !== transaction.receiverAddress.toLowerCase()) {
        accountsAddresses.push(transaction.receiverAddress.toLowerCase())
      }
      const newTransaction = { ...transaction, accountsAddresses }
      this.saveTransaction(newTransaction)
    })
    await Promise.all(migratedTransactions)
    const storageKey = TXN_Storage.crateStorageKey(accountAddress, networkName)
    const itemsToSave = TXN_Storage.Storage.getItem(storageKey)
    if (itemsToSave) {
      TXN_Storage.Storage.setItem(`${storageKey}_deprecated`, itemsToSave)
      TXN_Storage.Storage.removeItem(storageKey)
    }
  }

  async saveTransaction(transaction) {
    if (!transaction.transactionHash) {
      return {}
    }
    const fixedTransactionStructure = JSON.parse(JSON.stringify(transaction))
    try {
      const transactionSaved = await dbInstance.transactions.put(fixedTransactionStructure)
      if (!transactionSaved || !transactionSaved.transactionHash) {
        return {}
      }
      return transactionSaved
    } catch (error) {
      console.error('Failed on save transaction', transaction)
      console.error(error.message)
      return {}
    }
  }

  async getTransactions(accountAddress, networkIds, { limit, offset }) {
    const totalTransactions = await dbInstance.transactions
      .where('networkId')
      .anyOf(networkIds)
      .and(transaction => transaction.accountsAddresses.includes(accountAddress.toLowerCase()))
      .count()
    const data = await dbInstance.transactions
      .where('networkId')
      .anyOf(networkIds)
      .and(transaction => transaction.accountsAddresses.includes(accountAddress.toLowerCase()))
      .offset(offset)
      .limit(limit)
      .reverse()
      .sortBy('timestamp')
    return {
      info: {
        total: totalTransactions,
        limit,
        offset,
      },
      data,
    }
  }
}
