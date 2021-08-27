import BRIDGE_ABI from '@/constants/abis/bridge.json'

export function decodeCrossEvent(web3, receipt) {
  const eventJsonInterface = BRIDGE_ABI.find(x => x.name === 'Cross' && x.type === 'event')
  if (!eventJsonInterface) {
    // Older version event
    return null
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
