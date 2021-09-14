// Store pattern https://v3.vuejs.org/guide/state-management.html#simple-state-management-from-scratch
import { reactive } from 'vue'

import Web3 from 'web3'
import RLogin from '@rsksmart/rlogin'
import WalletConnectProvider from '@walletconnect/web3-provider'

import {
  TEST_NET_KOVAN_CONFIG,
  TEST_NET_BINANCE_CONFIG,
  TEST_NET_RSK_CROSS_KOVAN_CONFIG,
  MAIN_NET_ETH_CONFIG,
  MAIN_NET_RSK_CONFIG,
} from '@/constants/networks.js'

import { TOKENS } from '@/constants/tokens.js'
import * as chainId from './constants/chainId'

const rskMainnetUri = MAIN_NET_RSK_CONFIG.rpc
const ethMainnetUri = MAIN_NET_ETH_CONFIG.rpc

const rpcMainnet = {
  [chainId.MAIN_NET_ETHEREUM]: ethMainnetUri,
  [chainId.MAIN_NET_RSK]: rskMainnetUri,
}

const supportedChainsMainnet = [
  chainId.MAIN_NET_ETHEREUM,
  chainId.MAIN_NET_RSK,
  chainId.MAIN_NET_BINANCE_SMART_CHAIN,
]

const TEST_NET_RSK_RPC = TEST_NET_RSK_CROSS_KOVAN_CONFIG.rpc
const TEST_NET_RSK_CROSS_CHAIN_RPC = TEST_NET_KOVAN_CONFIG.rpc

const rpcTestnet = {
  [chainId.TEST_NET_BINANCE]: TEST_NET_BINANCE_CONFIG.rpc,
  [chainId.TEST_NET_KOVAN]: TEST_NET_KOVAN_CONFIG.rpc,
  [chainId.TEST_NET_RSK]: TEST_NET_RSK_RPC,
}

const supportedChainsTestnet = [
  chainId.TEST_NET_KOVAN,
  chainId.TEST_NET_RSK,
  chainId.TEST_NET_BINANCE,
]

const isTestnet = !(process.env.VUE_APP_IS_MAINNET == 'true')
const rskConfig = isTestnet ? TEST_NET_RSK_CROSS_KOVAN_CONFIG : MAIN_NET_RSK_CONFIG
const sideChainConfig = isTestnet ? TEST_NET_KOVAN_CONFIG : MAIN_NET_ETH_CONFIG
const tokens = TOKENS.filter(x => {
  return x[rskConfig.networkId] && x[sideChainConfig.networkId]
}).sort((first, second) => first.typeId - second.typeId)

const rLogin = new RLogin({
  cachedProvider: false,
  providerOptions: {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        rpc: isTestnet ? rpcTestnet : rpcMainnet,
      },
    },
  },
  supportedChains: isTestnet ? supportedChainsTestnet : supportedChainsMainnet,
})

export const store = {
  state: reactive({
    web3: null,
    provider: null,
    dataVault: null,
    disconnect: null,
    isTestnet: isTestnet,
    rLogin: rLogin,
    isConnected: false,
    accountAddress: '',
    currentConfig: null,
    chainId: null,
    rskWeb3: isTestnet ? new Web3(TEST_NET_RSK_RPC) : new Web3(rskMainnetUri),
    ethWeb3: isTestnet ? new Web3(TEST_NET_RSK_CROSS_CHAIN_RPC) : new Web3(ethMainnetUri),
    rskConfig: rskConfig,
    ethConfig: sideChainConfig,
    tokens: tokens,
    connectionError: '',
  }),
  accountsChanged(accounts) {
    if (accounts.length === 0) {
      store.state.connectionError =
        'Nifty Wallet, Liquality or MetaMask is Locked, please unlock it and Reload the page to continue'
    }
    store.state.accountAddress = accounts[0]
  },
  async chainChanged(chainId) {
    const state = store.state
    state.chainId = parseInt(chainId)
    if (rskConfig.networkId == chainId) {
      state.currentConfig = state.rskConfig
    } else if (sideChainConfig.networkId == chainId) {
      state.currentConfig = state.ethConfig
    } else {
      state.isConnected = false
      state.connectionError = `Unknown network, should be ${rskConfig.name} or ${sideChainConfig.name} networks`
      return
    }
    if (state.web3) {
      const accounts = await state.web3.eth.getAccounts()
      store.accountsChanged(accounts)
    }
  },
  handleDisconnect() {
    const state = store.state
    if (state.disconnect) state.disconnect()
    state.isConnected = false
    state.accountAddress = ''
    state.provider = null
    state.dataVault = null
    state.disconnect = null
    state.web3 = null
    state.currentConfig = null
  },
  handleLogin() {
    const state = store.state
    state.connectionError = ''
    return rLogin
      .connect()
      .then(async function(rLoginResponse) {
        state.provider = rLoginResponse.provider
        state.dataVault = rLoginResponse.dataVault
        state.disconnect = rLoginResponse.disconnect
        state.web3 = new Web3(rLoginResponse.provider)

        const chainId = await state.web3.eth.net.getId()
        store.chainChanged(chainId)
        state.isConnected = true
        state.provider.on('chainChanged', store.chainChanged)
        state.provider.on('accountsChanged', store.accountsChanged)
      })
      .catch(function(err) {
        console.error(err)
        store.handleDisconnect()
        if (!err.includes('Modal closed by user')) {
          store.state.connectionError = `${err.message}. Login failed. Please try again.`
        }
      })
  },
  async getGasPriceHex() {
    const state = store.state
    const web3 = state.web3
    const config = state.currentConfig
    var gasPriceParsed = 0
    if (config.networkId >= 30 && config.networkId <= 33) {
      const block = await web3.eth.getBlock('latest')
      gasPriceParsed = parseInt(block.minimumGasPrice)
      gasPriceParsed = gasPriceParsed <= 1 ? 1 : gasPriceParsed * 1.03
    } else {
      const gasPriceAvg = await web3.eth.getGasPrice()
      gasPriceParsed = parseInt(gasPriceAvg)
      gasPriceParsed = gasPriceParsed <= 1 ? 1 : gasPriceParsed * 1.3
    }
    return `0x${Math.ceil(gasPriceParsed).toString(16)}`
  },
}
