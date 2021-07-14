// Store pattern https://v3.vuejs.org/guide/state-management.html#simple-state-management-from-scratch
import { reactive } from 'vue'

import Web3 from 'web3'
import RLogin from '@rsksmart/rlogin'
import WalletConnectProvider from '@walletconnect/web3-provider'

import {
  KOVAN_CONFIG,
  RSK_TESTNET_CONFIG,
  ETH_CONFIG,
  RSK_MAINNET_CONFIG,
} from '@/constants/networks.js'

import { TOKENS } from '@/constants/tokens.js'

const infuraKey = process.env.VUE_APP_INFURA_KEY
const rskMainnetUri = 'https://public-node.rsk.co'
const ethMainnetUri = `https://mainnet.infura.io/v3/${infuraKey}`

const rpcMainnet = {
  1: ethMainnetUri,
  30: rskMainnetUri,
}
const supportedChainsMainnet = [1, 30]

const rskTestnetUri = 'https://public-node.testnet.rsk.co'
const kovanUri = `https://kovan.infura.io/v3/${infuraKey}`

const rpcTestnet = {
  42: kovanUri,
  31: rskTestnetUri,
}
const supportedChainsTestnet = [42, 31]

const isTestnet = window.location.href.includes('testnet')
const rskConfig = isTestnet ? RSK_TESTNET_CONFIG : RSK_MAINNET_CONFIG
const ethConfig = isTestnet ? KOVAN_CONFIG : ETH_CONFIG
const tokens = TOKENS.filter(x => {
  return x[rskConfig.networkId] && x[ethConfig.networkId]
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
    rskWeb3: isTestnet ? new Web3(rskTestnetUri) : new Web3(rskMainnetUri),
    ethWeb3: isTestnet ? new Web3(kovanUri) : new Web3(ethMainnetUri),
    rskConfig: rskConfig,
    ethConfig: ethConfig,
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
    console.log('chainChanged(chainId)', parseInt(chainId))
    const state = store.state
    state.chainId = parseInt(chainId)
    if (rskConfig.networkId == chainId) {
      state.currentConfig = state.rskConfig
    } else if (ethConfig.networkId == chainId) {
      state.currentConfig = state.ethConfig
    } else {
      state.isConnected = false
      state.connectionError = `Unknown network, should be ${rskConfig.name} or ${ethConfig.name} networks`
      return
    }
    const accounts = await state.web3.eth.getAccounts()
    store.accountsChanged(accounts)
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
}
