import dbInstance from '@/config/offlineDB.connection'
import { TXN_Storage } from '@/utils'

export class TransactionService {
  async synchronizeTransactions(accountAddress = '', networkName = '') {
    if (!TXN_Storage.isStorageAvailable('localStorage')) {
      return
    }
    const transactions = TXN_Storage.getAllTxns4Address(accountAddress, networkName)
    const migratedTransactions = transactions.map(transaction =>
      this.saveTransaction({ ...transaction, accountAddress }),
    )
    await Promise.all(migratedTransactions)
    const storageKey = TXN_Storage.crateStorageKey(accountAddress, networkName).toLowerCase()
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
    try {
      const transactionSaved = await dbInstance.transactions.put(transaction)
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

  getTransactions(accountAddress) {
    return dbInstance.transactions
      .where({ accountAddress })
      .reverse()
      .sortBy('timestamp')
  }
}
