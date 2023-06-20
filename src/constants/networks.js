import * as chainId from './chainId'
import {
  MAIN_NET_ETHEREUM_TOKENS,
  MAIN_NET_ETHEREUM_MAIN_TOKEN,
  MAIN_NET_ETHEREUM_GAS_TOKEN,
} from './tokens/mainNetEthereum'
import {
  MAIN_NET_RSK_CROSS_ETHEREUM_TOKENS,
  MAIN_NET_RSK_CROSS_ETHEREUM_MAIN_TOKEN,
  MAIN_NET_RSK_CROSS_ETHEREUM_GAS_TOKEN,
} from './tokens/mainNetRskCrossEthereum'
import {
  TEST_NET_SEPOLIA_TOKENS,
  TEST_NET_SEPOLIA_MAIN_TOKEN,
  TEST_NET_SEPOLIA_GAS_TOKEN,
} from './tokens/testNetSepolia'
import {
  TEST_NET_RSK_CROSS_SEPOLIA_TOKENS,
  TEST_NET_RSK_CROSS_SEPOLIA_MAIN_TOKEN,
  TEST_NET_RSK_CROSS_SEPOLIA_GAS_TOKEN,
} from './tokens/testNetRskCrossSepolia'
import ENVIRONMENTS from '@/constants/environments'

const infuraKey = process.env.VUE_APP_INFURA_KEY

// --------- CONFIGS ----------
export const TEST_NET_SEPOLIA_CONFIG = {
  networkId: chainId.TEST_NET_SEPOLIA,
  name: 'Sepolia',
  localStorageName: 'ethereum-sepolia',
  bridge: '0xd31e66af9d830bfc35e493929a8f6523ca2b01b1',
  allowTokens: '0x926d302f3b6bc4d0eeea9caf6942fd7e0a9a0422',
  federation: '0x091e26c96e7f4aaef0d85746bb99b733ec28df90',
  explorer: 'https://sepolia.etherscan.io',
  explorerTokenTab: '#tokentxns',
  secondsPerBlock: 5,
  rpc: `https://eth-sepolia.g.alchemy.com/v2/XYoI2LCj_cewOlIkbbUGCAbjDOGRiAAL`,
  v2UpdateBlock: 3724896,
  feePercentageDivider: 10_000,
  tokenPrefix: '',
  env: ENVIRONMENTS.TESTNET,
  mainToken: TEST_NET_SEPOLIA_MAIN_TOKEN,
  gasToken: TEST_NET_SEPOLIA_GAS_TOKEN,
  isRsk: false,
  isSide: true,
  tokens: getTokensWithReceiveToken(TEST_NET_SEPOLIA_TOKENS, TEST_NET_RSK_CROSS_SEPOLIA_TOKENS),
}

export const TEST_NET_RSK_CROSS_SEPOLIA_CONFIG = {
  networkId: chainId.TEST_NET_RSK,
  name: 'RSK Testnet',
  localStorageName: 'rsk-testnet',
  bridge: '0x21df59aef6175467fefb9e44fbb98911978a13f2',
  allowTokens: '0xa683146bb93544068737dfca59f098e7844cdfa8',
  federation: '0x73de98b3eb19cae5dfc71fb3e54f3ffd4aa02705',
  relayer: '0x7c77704007C9996Ee591C516f7319828BA49d91E',
  swapRbtcProxy: '0x7c77704007C9996Ee591C516f7319828BA49d91E',
  explorer: 'https://explorer.testnet.rsk.co',
  explorerTokenTab: '?__tab=tokens%20transfers',
  secondsPerBlock: 30,
  rpc: 'https://public-node.testnet.rsk.co',
  v2UpdateBlock: 3987787,
  feePercentageDivider: 10_000,
  crossToNetwork: TEST_NET_SEPOLIA_CONFIG,
  tokenPrefix: 'r',
  env: ENVIRONMENTS.TESTNET,
  mainToken: TEST_NET_RSK_CROSS_SEPOLIA_MAIN_TOKEN,
  gasToken: TEST_NET_RSK_CROSS_SEPOLIA_GAS_TOKEN,
  isRsk: true,
  isSide: false,
  tokens: getTokensWithReceiveToken(TEST_NET_RSK_CROSS_SEPOLIA_TOKENS, TEST_NET_SEPOLIA_TOKENS),
}
TEST_NET_SEPOLIA_CONFIG.crossToNetwork = TEST_NET_RSK_CROSS_SEPOLIA_CONFIG

export const MAIN_NET_ETH_CONFIG = {
  networkId: chainId.MAIN_NET_ETHEREUM,
  name: 'Ethereum',
  localStorageName: 'eth-mainnet',
  bridge: '0x12ed69359919fc775bc2674860e8fe2d2b6a7b5d',
  allowTokens: '0xA3FC98e0a7a979677BC14d541Be770b2cb0A15F3',
  federation: '0x5e29C223d99648C88610519f96E85E627b3ABe17',
  explorer: 'https://etherscan.io',
  explorerTokenTab: '#tokentxns',
  secondsPerBlock: 15,
  rpc: `https://mainnet.infura.io/v3/${infuraKey}`,
  v2UpdateBlock: 12871770,
  feePercentageDivider: 10_000,
  tokenPrefix: 'e',
  env: ENVIRONMENTS.MAINNET,
  mainToken: MAIN_NET_ETHEREUM_MAIN_TOKEN,
  gasToken: MAIN_NET_ETHEREUM_GAS_TOKEN,
  isRsk: false,
  isSide: true,
  tokens: getTokensWithReceiveToken(MAIN_NET_ETHEREUM_TOKENS, MAIN_NET_RSK_CROSS_ETHEREUM_TOKENS),
}

export const MAIN_NET_RSK_CONFIG = {
  networkId: chainId.MAIN_NET_RSK,
  name: 'RSK Mainnet',
  localStorageName: 'rsk-mainnet',
  bridge: '0x9d11937e2179dc5270aa86a3f8143232d6da0e69',
  allowTokens: '0xcb789036894a83a008a2aa5b3c2dde41d0605a9a',
  federation: '0x7ecfda6072942577d36f939ad528b366b020004b',
  explorer: 'https://explorer.rsk.co',
  explorerTokenTab: '?__tab=tokens%20transfers',
  secondsPerBlock: 30,
  rpc: 'https://public-node.rsk.co',
  v2UpdateBlock: 3540341,
  feePercentageDivider: 10_000,
  crossToNetwork: MAIN_NET_ETH_CONFIG,
  tokenPrefix: 'r',
  env: ENVIRONMENTS.MAINNET,
  mainToken: MAIN_NET_RSK_CROSS_ETHEREUM_MAIN_TOKEN,
  gasToken: MAIN_NET_RSK_CROSS_ETHEREUM_GAS_TOKEN,
  isRsk: true,
  isSide: false,
  tokens: getTokensWithReceiveToken(MAIN_NET_RSK_CROSS_ETHEREUM_TOKENS, MAIN_NET_ETHEREUM_TOKENS),
}
MAIN_NET_ETH_CONFIG.crossToNetwork = MAIN_NET_RSK_CONFIG

export const rskNetworks = [MAIN_NET_RSK_CONFIG, TEST_NET_RSK_CROSS_SEPOLIA_CONFIG]

export const defaultNetworks = {
  [ENVIRONMENTS.MAINNET]: {
    rskConfig: MAIN_NET_RSK_CONFIG,
    sideConfig: MAIN_NET_ETH_CONFIG,
  },
  [ENVIRONMENTS.TESTNET]: {
    rskConfig: TEST_NET_RSK_CROSS_SEPOLIA_CONFIG,
    sideConfig: TEST_NET_SEPOLIA_CONFIG,
  },
}

export const SWAP_RBTC_PROXY_ADDRESS = {
  address: '0x48288D0e3079A03f6EC1846554CFc58C2696Aaee',
  explorer: '0x74Ce26A2e4c1368C48A0157CE762944d282896Db',
  network: 'rsk',
  identifier: 'SWAP_RBTC_PROXY_V1',
  name: 'SwapRbtcProxy v1',
  tag: 'v1',
  networkId: chainId.MAIN_NET_RSK,
}

export const defaultProjectsAddress = [SWAP_RBTC_PROXY_ADDRESS]

function getReceiveToken(mainToken, sideTokens) {
  const receiveTokens = sideTokens.filter((token) => token.token == mainToken.token)
  if (receiveTokens.length == 0) {
    return {}
  }
  return receiveTokens[0]
}

function getTokensWithReceiveToken(mainTokens, sideTokens) {
  const mainTokensSort = mainTokens.sort((first, second) => first.typeId - second.typeId)
  return mainTokensSort.map((token) => ({
    ...token,
    receiveToken: getReceiveToken(token, sideTokens),
  }))
}

export function findNetworkByChainId(chainId, crossToNetworkId) {
  const networks = getNetworksAvailable()
  return networks.find(
    (net) => net.networkId === chainId && net.crossToNetwork.networkId === crossToNetworkId,
  )
}

export function getNetworksConf(selectedChainId, prevChainId = null) {
  const networksAvailable = getNetworksAvailable()
  const networks = networksAvailable.filter((net) => net.networkId === selectedChainId)
  if (!networks || networks.length === 0) {
    throw new Error(`Network ${selectedChainId} not found`)
  }

  if (networks.length !== 1) {
    if (prevChainId) {
      const networkConfig = getNetworksConf(prevChainId, null)
      return {
        ...networkConfig,
        networks,
      }
    }
    return {
      ...defaultNetworks[process.env.VUE_APP_ENV],
      networks,
    }
  }

  const [network] = networks
  return {
    rskConfig: network.isRsk ? network : network.crossToNetwork,
    sideConfig: network.isSide ? network : network.crossToNetwork,
    networks,
  }
}

export function getEnvironmentNetworks() {
  return rskNetworks.filter((network) => network.env === process.env.VUE_APP_ENV)
}

export function getNetworksAvailable() {
  const networksOnEnvironment = getEnvironmentNetworks()
  const sideNetworks = networksOnEnvironment.map((network) => network.crossToNetwork)
  return [...networksOnEnvironment, ...sideNetworks]
}

export function getNonDuplicateNetworks() {
  const networks = getNetworksAvailable()
  const reducedNetworks = networks.reduce((acc, network) => {
    if (!acc.has(network.networkId)) {
      acc.set(network.networkId, network)
    }
    return acc
  }, new Map())
  return [...reducedNetworks.values()]
}
