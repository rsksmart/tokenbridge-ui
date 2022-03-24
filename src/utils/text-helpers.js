import { sanitizeTxHash } from '@/utils/index'

export const isEmptyAddress = (addressString) => /(0x)[0]+/i.test(addressString)

export const txExplorerLink = (txHash, explorerLink) => {
  const sanitizedTxHash = sanitizeTxHash(txHash)
  if (!txHash) {
    return ''
  }
  return `<a target="_blank" href="${explorerLink}/tx/${sanitizedTxHash}">see Tx</a>`
}

export const convertToNumber = (value) => {
  if (typeof value === 'number') {
    return value
  }
  if (typeof value === 'string') {
    const radix = value.startsWith('0x') ? 16 : 10
    return parseInt(value, radix)
  }

  return value
}
