/**
 * It's used only for migration, considered delete on next version
 * @deprecated
 */
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
        this.Storage &&
        this.Storage.length !== 0
      )
    }
  }

  static removeAllTxns4Address(accountAddress = '', networkName = '') {
    let key = `${accountAddress}-${networkName.replace(' ', '-')}`
    this.serializeTxns(key, [])
  }

  static getAllTxns4Address(accountAddress = '', networkName = '') {
    let key = `${accountAddress}-${networkName.replace(' ', '-')}`
    let { txns } = this.unserializeTxns(key)
    return txns
  }

  static addTxn(accountAddress, networkName = '', data = {}) {
    const key = `${accountAddress}-${networkName.replace(' ', '-')}`
    const { txns } = this.unserializeTxns(key)
    txns.push(data)
    this.serializeTxns(key, txns)
  }

  static addOrUpdateTxn(accountAddress, networkName = '', data = {}) {
    const key = `${accountAddress}-${networkName.replace(' ', '-')}`
    const { txns } = this.unserializeTxns(key)
    let found = false
    for (var i in txns) {
      if (txns[i].transactionHash == data.transactionHash) {
        txns[i] = data
        found = true
        break
      }
    }
    if (!found) {
      txns.push(data)
    }
    this.serializeTxns(key, txns)
  }

  static unserializeTxns(key = '') {
    let rawTxns = this.Storage.getItem(key.toLowerCase())
    let returnObj = { key, txns: JSON.parse(rawTxns) || [] }
    return returnObj
  }

  static createStorageKey(accountAddress, networkName) {
    return `${accountAddress}-${networkName.replace(' ', '-')}`.toLowerCase()
  }

  static serializeTxns(key, transactions = []) {
    this.Storage.setItem(key.toLowerCase(), JSON.stringify(transactions))
  }
}
