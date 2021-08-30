import BRIDGE_ABI_V2 from '@/constants/abis/bridge.json'
import BRIDGE_ABI_V1 from '@/constants/abis/bridge_v1.json'
import BRIDGE_ABI_V0 from '@/constants/abis/bridge_v0.json'

export function decodeCrossEvent(web3, receipt) {
  let result = getEventForAbi(web3, receipt, BRIDGE_ABI_V2, 'Cross')
  if (result) return result
  result = getEventForAbi(web3, receipt, BRIDGE_ABI_V1, 'Cross')
  if (result) return result
  result = getEventForAbi(web3, receipt, BRIDGE_ABI_V0, 'Cross')
  return result
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
