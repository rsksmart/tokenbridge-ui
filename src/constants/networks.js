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
  TEST_NET_BINANCE_TOKENS,
  TEST_NET_BINANCE_MAIN_TOKEN,
  TEST_NET_BINANCE_GAS_TOKEN,
} from './tokens/testNetBinance'
import {
  TEST_NET_KOVAN_TOKENS,
  TEST_NET_KOVAN_MAIN_TOKEN,
  TEST_NET_KOVAN_GAS_TOKEN,
} from './tokens/testNetKovan'
import {
  TEST_NET_RSK_CROSS_BINANCE_TOKENS,
  TEST_NET_RSK_CROSS_BINANCE_MAIN_TOKEN,
  TEST_NET_RSK_CROSS_BINANCE_GAS_TOKEN,
} from './tokens/testNetRskCrossBinance'
import {
  TEST_NET_RSK_CROSS_KOVAN_TOKENS,
  TEST_NET_RSK_CROSS_KOVAN_MAIN_TOKEN,
  TEST_NET_RSK_CROSS_KOVAN_GAS_TOKEN,
} from './tokens/testNetRskCrossKovan'
import ENVIRONMENTS from '@/constants/environments'

const infuraKey = process.env.VUE_APP_INFURA_KEY

// --------- CONFIGS ----------
export const TEST_NET_BINANCE_CONFIG = {
  networkId: chainId.TEST_NET_BINANCE,
  name: 'Binance Smartchain Testnet',
  localStorageName: 'bsc-testnet',
  bridge: '0xd9d2f9ee990ddb1147e595ae4f69ec468a0b58d0',
  allowTokens: '0x9a64fc2416EE2157e19DC2C79B5B22D113a9E0C3',
  federation: '0xD40F8613173E636D570c47dB3A6Ac57EA9ccac83',
  explorer: 'https://testnet.bscscan.com/',
  explorerTokenTab: '#tokentxns',
  secondsPerBlock: 5,
  rpc: 'https://data-seed-prebsc-2-s2.binance.org:8545/',
  v2UpdateBlock: 1,
  feePercentageDivider: 10_000,
  tokenPrefix: 'b',
  env: ENVIRONMENTS.TESTNET,
  mainToken: TEST_NET_BINANCE_MAIN_TOKEN,
  gasToken: TEST_NET_BINANCE_GAS_TOKEN,
  isRsk: false,
  isSide: true,
  tokens: getTokensWithReceiveToken(TEST_NET_BINANCE_TOKENS, TEST_NET_RSK_CROSS_BINANCE_TOKENS),
}

export const TEST_NET_KOVAN_CONFIG = {
  networkId: chainId.TEST_NET_KOVAN,
  name: 'Kovan',
  localStorageName: 'ethereum-kovan',
  bridge: '0x12ed69359919fc775bc2674860e8fe2d2b6a7b5d',
  allowTokens: '0x92BF86334583909B60F9b798A9Dd7Debd899fEc4',
  federation: '0xa347438BC288f56Cb6083A79133e70DD2d1f6c2d',
  explorer: 'https://kovan.etherscan.io',
  explorerTokenTab: '#tokentxns',
  secondsPerBlock: 5,
  rpc: `https://kovan.infura.io/v3/${infuraKey}`,
  v2UpdateBlock: 25547922,
  feePercentageDivider: 10_000,
  tokenPrefix: 'e',
  env: ENVIRONMENTS.TESTNET,
  mainToken: TEST_NET_KOVAN_MAIN_TOKEN,
  gasToken: TEST_NET_KOVAN_GAS_TOKEN,
  isRsk: false,
  isSide: true,
  tokens: getTokensWithReceiveToken(TEST_NET_KOVAN_TOKENS, TEST_NET_RSK_CROSS_KOVAN_TOKENS),
}

export const TEST_NET_RSK_CROSS_KOVAN_CONFIG = {
  networkId: chainId.TEST_NET_RSK,
  name: 'RSK Testnet',
  localStorageName: 'rsk-testnet',
  bridge: '0x684a8a976635fb7ad74a0134ace990a6a0fcce84',
  allowTokens: '0xc65bf0ae75dc1a5fc9e6f4215125692a548c773a',
  federation: '0x5d663981d930e8ec108280b9d80885658148ab0f',
  relayer: '0x7c77704007C9996Ee591C516f7319828BA49d91E',
  swapRbtcProxy: '0x7c77704007C9996Ee591C516f7319828BA49d91E',
  explorer: 'https://explorer.testnet.rsk.co',
  explorerTokenTab: '?__tab=tokens%20transfers',
  secondsPerBlock: 30,
  rpc: 'https://public-node.testnet.rsk.co',
  v2UpdateBlock: 1945524,
  feePercentageDivider: 10_000,
  crossToNetwork: TEST_NET_KOVAN_CONFIG,
  tokenPrefix: 'r',
  env: ENVIRONMENTS.TESTNET,
  mainToken: TEST_NET_RSK_CROSS_KOVAN_MAIN_TOKEN,
  gasToken: TEST_NET_RSK_CROSS_KOVAN_GAS_TOKEN,
  isRsk: true,
  isSide: false,
  tokens: getTokensWithReceiveToken(TEST_NET_RSK_CROSS_KOVAN_TOKENS, TEST_NET_KOVAN_TOKENS),
}
TEST_NET_KOVAN_CONFIG.crossToNetwork = TEST_NET_RSK_CROSS_KOVAN_CONFIG

export const TEST_NET_RSK_CROSS_BINANCE_CONFIG = {
  networkId: chainId.TEST_NET_RSK,
  name: 'RSK Testnet',
  localStorageName: 'rsk-testnet',
  bridge: '0x4ec10A50801f89266F0F1FA7fd3fa320106bBF63',
  allowTokens: '0xd5343aafd8bfe2960d4E832201CB69CD04E531d5',
  federation: '0xe450bBE6C28cCd253a56ac24c55E44015e576783',
  explorer: 'https://explorer.testnet.rsk.co',
  explorerTokenTab: '?__tab=tokens%20transfers',
  secondsPerBlock: 30,
  rpc: 'https://public-node.testnet.rsk.co',
  v2UpdateBlock: 1945524,
  feePercentageDivider: 10_000,
  crossToNetwork: TEST_NET_BINANCE_CONFIG,
  tokenPrefix: 'b',
  env: ENVIRONMENTS.TESTNET,
  mainToken: TEST_NET_RSK_CROSS_BINANCE_MAIN_TOKEN,
  gasToken: TEST_NET_RSK_CROSS_BINANCE_GAS_TOKEN,
  isRsk: true,
  isSide: false,
  tokens: getTokensWithReceiveToken(TEST_NET_RSK_CROSS_BINANCE_TOKENS, TEST_NET_BINANCE_TOKENS),
}
TEST_NET_BINANCE_CONFIG.crossToNetwork = TEST_NET_RSK_CROSS_BINANCE_CONFIG

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

export const rskNetworks = [
  MAIN_NET_RSK_CONFIG,
  TEST_NET_RSK_CROSS_BINANCE_CONFIG,
  TEST_NET_RSK_CROSS_KOVAN_CONFIG,
]

export const defaultNetworks = {
  [ENVIRONMENTS.MAINNET]: {
    rskConfig: MAIN_NET_RSK_CONFIG,
    sideConfig: MAIN_NET_ETH_CONFIG,
  },
  [ENVIRONMENTS.TESTNET]: {
    rskConfig: TEST_NET_RSK_CROSS_KOVAN_CONFIG,
    sideConfig: TEST_NET_KOVAN_CONFIG,
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
