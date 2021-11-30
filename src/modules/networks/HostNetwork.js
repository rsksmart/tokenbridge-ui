import Network from '@/modules/networks/Network'
import { retry3Times } from '@/utils'

export default class HostNetwork extends Network {
  async getTypesLimits(contract) {
    try {
      const limits = await retry3Times(contract.methods.getTypesLimits().call)
      if (!limits) {
        throw new Error(`Wrong value for limits ${limits}`)
      }
      return limits
    } catch (error) {
      throw new Error(`Error in getTypesLimits ${error.message}`)
    }
  }
}
