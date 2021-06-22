/**
* Poll given network for latest block number
*
* @param {Function} cb: callback function to call upon new value
*/
export async function poll4LastBlockNumber(cb) {
    let interval = 5_000;
    let { number } = await web3.eth.getBlock('latest');
    cb(number);

    let intervalId = setInterval(async () => {
        let { number } = await web3.eth.getBlock('latest');
        cb(number);
    }, interval);

    return intervalId;
};
