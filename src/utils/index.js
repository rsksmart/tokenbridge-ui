import moment from 'moment'

// local Storage Static utilities
export * from './txns-storage'

export function blocksToTime(blocks, timePerBlock) {
  return blocks && timePerBlock ? moment.duration(blocks * timePerBlock, 'seconds').humanize() : ''
}

export const NULL_ADDRESS = '0x0000000000000000000000000000000000000000'
export const NULL_HASH = '0x0000000000000000000000000000000000000000000000000000000000000000'
export const MAX_UINT256 =
  '115792089237316195423570985008687907853269984665640564039457584007913129639935'

/* Checks if the given string is an address
 *
 * @method isAddress
 * @param {String} address the given HEX adress
 * @return {Boolean}
 */
export function isAddress(address) {
  return /^(0x)?[0-9a-fA-F]{40}$/i.test(address)
}

/**
 * Poll given network for latest block number
 *
 * @param {Function} cb: callback function to call upon new value
 */
export async function poll4LastBlockNumber(web3, cb) {
  let interval = 5_000
  let number = await web3.eth.getBlockNumber()
  cb(number)

  let intervalId = setInterval(async () => {
    let number = await web3.eth.getBlockNumber()
    cb(number)
  }, interval)

  return intervalId
}

/**
 * Credit to: https://arjunphp.com/can-paginate-array-objects-javascript/
 */
export function Paginator(items, page = 1, per_page = 5) {
  let offset = (page - 1) * per_page
  let data = items.slice(offset).slice(0, per_page)
  let total_pages = Math.ceil(items.length / per_page)

  return {
    page,
    per_page,
    pre_page: page - 1 ? page - 1 : null,
    next_page: total_pages > page ? page + 1 : null,
    total: items.length,
    total_pages,
    data,
  }
}

const clone = obj => {
  if (obj === null || typeof obj !== 'object') {
    return obj
  } else if (Array.isArray(obj)) {
    let clonedArr = []
    for (const data of obj) {
      clonedArr.push(clone(data))
    }
    return clonedArr
  } else {
    let clonedObj = {}
    const keys = Object.keys(obj)
    for (const key of keys) {
      clonedObj[key] = clone(obj[key])
    }
    return clonedObj
  }
}

/**
 * Retry system with async / await
 *
 * @param {Function} fn : function to execute
 * @param {Array} args : arguments of fn function
 * @param {Object} config : arguments of fn function
 * @property {Number} config.retriesMax : number of retries, by default 3
 * @property {Number} config.interval : interval (in ms) between retry, by default 0
 * @property {Boolean} config.exponential : use exponential retry interval, by default true
 * @property {Number} config.factor: interval incrementation factor
 * @property {Number} config.isCb: is fn a callback style function ?
 */
export async function retry(fn, args = [], config = {}) {
  const retriesMax = config.retriesMax || 3
  let interval = config.interval || 0
  const exponential = config.hasOwnProperty('exponential') ? config.exponential : true
  const factor = config.factor || 2

  for (let i = 0; i < retriesMax; i++) {
    try {
      if (!config.isCb) {
        const val = await fn.apply(null, args)
        return val
      } else {
        const val = await getPromise(fn, clone(args))
        return val
      }
    } catch (error) {
      if (retriesMax === i + 1 || (error.hasOwnProperty('retryable') && !error.retryable))
        throw error

      interval = exponential ? interval * factor : interval
      // if interval is set to zero, do not use setTimeout, gain 1 event loop tick
      if (interval) await new Promise(r => setTimeout(r, interval))
    }
  }
}

export async function retry3Times(func, params = null) {
  return retry(func, params, { retriesMax: 3, interval: 1_000, exponential: false })
}

export async function waitForReceipt(txHash, web3) {
  let timeElapsed = 0
  const interval = 10_000
  return new Promise((resolve, reject) => {
    const checkInterval = setInterval(async () => {
      timeElapsed += interval
      const receipt = await web3.eth.getTransactionReceipt(txHash)
      if (receipt != null) {
        clearInterval(checkInterval)
        return resolve(receipt)
      }
      if (timeElapsed > 300_000) {
        clearInterval(checkInterval)
        return reject(
          new Error(
            'Transaction was not mined within 300 seconds. Be aware that it might still be mined!',
          ),
        )
      }
    }, interval)
  })
}
