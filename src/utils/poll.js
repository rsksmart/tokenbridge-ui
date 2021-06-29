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
