export class TXN_Storage {
  static Storage

  static isStorageAvailable(type) {
    try {
      this.Storage = window[type]
      let x = '__storage_test__'
      this.Storage.setItem(x, x)
      this.Storage.removeItem(x)
      return true
    } catch (e) {
      return (
        e instanceof DOMException &&
        // everything except Firefox
        (e.code === 22 ||
          // Firefox
          e.code === 1014 ||
          // test name field too, because code might not be present
          // everything except Firefox
          e.name === 'QuotaExceededError' ||
          // Firefox
          e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
        // acknowledge QuotaExceededError only if there's something already stored
        storage &&
        storage.length !== 0
      )
    }
  }

  static getAllTxns4Address(accountAddress = '', networkName = '') {
    let key = `${accountAddress}-${networkName.toLowerCase().replace(' ', '-')}`
    let { _, txns } = this.unserializeTxns(key)
    return txns.sort((txn1, txn2) => {
      return txn1.blockNumber <= txn2.blockNumber ? 1 : -1
    })
  }

  static addTxn(accountAddress, networkName = '', data = {}) {
    const key = `${accountAddress}-${networkName.toLowerCase().replace(' ', '-')}`
    let { txns } = this.unserializeTxns(key)
    this.serializeTxns(key, [...txns, data])
  }

  static updateTxn(accountAddress, networkName = '', data = {}) {
    const key = `${accountAddress}-${networkName.toLowerCase().replace(' ', '-')}`
    let { txns } = this.unserializeTxns(key)
    console.log('data', data)
    console.log('txns', txns)
    for (var i in txns) {
      if (txns[i].transactionHash == data.transactionHash) {
        txns[i] = data
        console.log('found', i)
        break
      }
    }
    console.log('txns', txns)
    this.serializeTxns(key, txns)
  }

  static unserializeTxns(key = '') {
    let rawTxns = this.Storage.getItem(key.toLowerCase())
    let returnObj = { key, txns: JSON.parse(rawTxns) || [] }
    return returnObj
  }

  static serializeTxns(key, transactions = []) {
    this.Storage.setItem(key.toLowerCase(), JSON.stringify(transactions))
  }
}
