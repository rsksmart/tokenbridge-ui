/* Checks if the given string is an address
 *
 * @method isAddress
 * @param {String} address the given HEX adress
 * @return {Boolean}
*/
export function isAddress(address) {
    return /^(0x)?[0-9a-fA-F]{40}$/i.test(address)
};
