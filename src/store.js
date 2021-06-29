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
})

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
    rskWeb3: isTestnet ? new Web3(rskTestnetUri) : new Web3(rskMainnetUri),
    ethWeb3: isTestnet ? new Web3(kovanUri) : new Web3(ethMainnetUri),
    rskConfig: rskConfig,
    ethConfig: ethConfig,
    tokens: tokens,
  }),
  handleLogin() {
    const state = this.state
    return rLogin
      .connect()
      .then(function(rLoginResponse) {
        state.provider = rLoginResponse.provider
        state.dataVault = rLoginResponse.dataVault
        state.disconnect = rLoginResponse.disconnect
        state.web3 = new Web3(rLoginResponse.provider)
        state.isConnected = true
      })
      .catch(function(err) {
        console.error(err)
        state.isConnected = false
        state.provider = null
        state.dataVault = null
        state.disconnect = null
        state.web3 = null
        throw new Error('Login failed. Please try again.')
      })
  },
}
