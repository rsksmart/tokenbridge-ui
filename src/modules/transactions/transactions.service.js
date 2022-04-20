import dbInstance from '@/config/offlineDB.connection'
import { TXN_Storage } from '@/utils'

export class TransactionService {
  static validateTimestamp(timestamp) {
    if (timestamp && timestamp.toString().length < Date.now().toString().length) {
      return parseInt(timestamp, 10) * 1000
    }
    return timestamp ?? 0
  }

  async synchronizeTransactions(accountAddress = '', hostConfig = {}, sideConfig = {}) {
    if (!TXN_Storage.isStorageAvailable('localStorage')) {
      return
    }
    const transactions = TXN_Storage.getAllTxns4Address(accountAddress, hostConfig.localStorageName)
    const migratedTransactions = transactions.map((transaction) => {
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
      transaction.timestamp = TransactionService.validateTimestamp(transaction.timestamp)
      transaction.destinationChainId =
        hostConfig.networkId === transaction.networkId ? sideConfig.networkId : hostConfig.networkId
      const accountsAddresses = [transaction.senderAddress.toLowerCase()]
      if (transaction.senderAddress.toLowerCase() !== transaction.receiverAddress.toLowerCase()) {
        accountsAddresses.push(transaction.receiverAddress.toLowerCase())
      }
      const newTransaction = { ...transaction, accountsAddresses }
      this.saveTransaction(newTransaction)
    })
    await Promise.all(migratedTransactions)
    const storageKey = TXN_Storage.createStorageKey(accountAddress, hostConfig.localStorageName)
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
      if (!transactionSaved || transactionSaved !== transaction.transactionHash) {
        return {}
      }
      return transaction
    } catch (error) {
      console.error('Failed on save transaction', transaction)
      console.error(error.message)
      return {}
    }
  }

  async getTransactions(accountAddress, networkIds, { limit, offset }) {
    const transactionIncludeAddress = (transaction) => {
      const addressLowerCase = accountAddress.toLowerCase()
      if (Array.isArray(transaction.accountsAddresses)) {
        return transaction.accountsAddresses.includes(addressLowerCase)
      }

      return (
        transaction?.receiverAddress?.toLowerCase() === addressLowerCase ||
        transaction?.senderAddress?.toLowerCase() === addressLowerCase ||
        transaction.from === addressLowerCase
      )
    }

    const totalTransactions = await dbInstance.transactions
      .where('networkId')
      .anyOf(networkIds)
      // Should be enable for display transactions that respect the origin and destination selected
      .and((transaction) => networkIds.includes(transaction.destinationChainId))
      .and((transaction) => transactionIncludeAddress(transaction))
      .count()

    const data = await dbInstance.transactions
      .where('networkId')
      .anyOf(networkIds)
      // Should be enable for display transactions that respect the origin and destination selected
      .and((transaction) => networkIds.includes(transaction.destinationChainId))
      .and((transaction) => transactionIncludeAddress(transaction))
      .reverse()
      .sortBy('timestamp')
    return {
      info: {
        total: totalTransactions,
        limit,
        offset,
      },
      data: data.slice(offset, offset + limit),
    }
  }
}
