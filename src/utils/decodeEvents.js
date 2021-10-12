import BRIDGE_ABI_V2 from '@/constants/abis/bridge.json'
import BRIDGE_ABI_V1 from '@/constants/abis/bridge_v1.json'
import BRIDGE_ABI_V0 from '@/constants/abis/bridge_v0.json'
import NFT_BRIDGE from '@/constants/abis/nft-bridge.json'
import { TOKEN_TYPE_ERC_20, TOKEN_TYPE_ERC_721 } from '@/constants/tokenType'

export function decodeCrossEvent(web3, receipt, tokenType) {
  switch (tokenType) {
    case TOKEN_TYPE_ERC_20:
      return decodeERC20CrossEvent(web3, receipt)
    case TOKEN_TYPE_ERC_721:
      return decodeERC721CrossEvent(web3, receipt)
    default:
      // in the old database schema, we aren't saving the token type, so the old transactions have an empty tokenType
      // for this reason, by default, all the transactions without token type are considered as ERC20
      return decodeERC20CrossEvent(web3, receipt)
  }
}

function decodeERC20CrossEvent(web3, receipt) {
  let result = getEventForAbi(web3, receipt, BRIDGE_ABI_V2, 'Cross')
  if (result) {
    return result
  }
  result = getEventForAbi(web3, receipt, BRIDGE_ABI_V1, 'Cross')
  if (result) {
    return result
  }
  return getEventForAbi(web3, receipt, BRIDGE_ABI_V0, 'Cross')
}

function decodeERC721CrossEvent(web3, receipt) {
  return getEventForAbi(web3, receipt, NFT_BRIDGE, 'Cross')
}

export function getEventForAbi(web3, receipt, abi, eventName) {
  let eventJsonInterface = abi.find(x => x.name === eventName && x.type === 'event')
  if (!eventJsonInterface) {
    return null // can't fin the event
  }
  const eventSignature = web3.eth.abi.encodeEventSignature(eventJsonInterface)
  const logIndex = receipt.logs.findIndex(x => x.topics[0] === eventSignature)
  const event = receipt.logs[logIndex]
  if (!event) {
    // No event
    return null
  }

  event.topics.shift()
  const decodedEvent = web3.eth.abi.decodeLog(eventJsonInterface.inputs, event.data, event.topics)
  return {
    event,
    decodedEvent,
  }
}
