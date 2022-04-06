import * as chainId from './chainId'
import {
  TEST_NET_KOVAN_CONFIG,
  TEST_NET_RSK_CROSS_KOVAN_CONFIG,
  MAIN_NET_ETH_CONFIG,
  MAIN_NET_RSK_CONFIG,
} from './networks'

const sideChainIdStr = process.env.VUE_APP_SIDE_CHAIN_ID
const mainChainIdStr = process.env.VUE_APP_MAIN_CHAIN_ID

const sideChainId = sideChainIdStr ? parseInt(sideChainIdStr, 10) : chainId.MAIN_NET_ETHEREUM
const mainChainId = mainChainIdStr ? parseInt(mainChainIdStr, 10) : chainId.MAIN_NET_RSK

// --------- CONFIGS ----------
export const TEST_NET_RPC = {
  [chainId.TEST_NET_KOVAN]: TEST_NET_KOVAN_CONFIG.rpc,
  [chainId.TEST_NET_RSK]: TEST_NET_RSK_CROSS_KOVAN_CONFIG.rpc,
}

export const MAIN_NET_RPC = {
  [chainId.MAIN_NET_ETHEREUM]: MAIN_NET_ETH_CONFIG.rpc,
  [chainId.MAIN_NET_RSK]: MAIN_NET_RSK_CONFIG.rpc,
}

export const ALL_RPC = {
  ...TEST_NET_RPC,
  ...MAIN_NET_RPC,
}

export function getMainRPC() {
  if (!mainChainId) {
    return MAIN_NET_RSK_CONFIG.rpc
  }
  return ALL_RPC[mainChainId]
}

export function getSideRPC() {
  if (!sideChainId) {
    return MAIN_NET_ETH_CONFIG.rpc
  }
  return ALL_RPC[sideChainId]
}
