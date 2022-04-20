import BRIDGE_ABI from '@/constants/abis/bridge.json'
import FEDERATION_ABI from '@/constants/abis/federation.json'
import { blocksToTime, retry3Times } from '@/utils'
import ALLOW_TOKENS_ABI from '@/constants/abis/allowTokens.json'

export default class Network {
  config = null
  constructor(chainConfig, web3) {
    this.config = chainConfig
    this.web3 = web3
  }

  async getFeePercentage() {
    const bridge = new this.web3.eth.Contract(BRIDGE_ABI, this.config.bridge)
    try {
      const fee = await bridge.methods.getFeePercentage().call()
      return fee / this.config.feePercentageDivider
    } catch (error) {
      throw new Error(`Error in getFeePercentage ${error.message}`)
    }
  }

  async getMembers() {
    const contract = new this.web3.eth.Contract(FEDERATION_ABI, this.config.federation)
    try {
      const members = await retry3Times(contract.methods.getMembers().call)
      if (!members) {
        return []
      }
      return members
    } catch (error) {
      throw new Error(`Error in getMembers ${error.message}`)
    }
  }

  async getTypesLimits() {
    return null
  }

  async getConfirmations(contract) {
    try {
      const { smallAmount, mediumAmount, largeAmount } = await retry3Times(
        contract.methods.getConfirmations().call,
      )
      return {
        smallAmount,
        smallAmountTime: blocksToTime(smallAmount, this.config.secondsPerBlock),
        mediumAmount,
        mediumAmountTime: blocksToTime(mediumAmount, this.config.secondsPerBlock),
        largeAmount,
        largeAmountTime: blocksToTime(largeAmount, this.config.secondsPerBlock),
      }
    } catch (error) {
      throw new Error(`Error in getConfirmations ${error.message}`)
    }
  }

  async allowTokensActions() {
    const contract = new this.web3.eth.Contract(ALLOW_TOKENS_ABI, this.config.allowTokens)
    const limits = await this.getTypesLimits(contract)
    const confirmations = await this.getConfirmations(contract)
    return { limits, confirmations }
  }
}
