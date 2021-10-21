// Store pattern https://v3.vuejs.org/guide/state-management.html#simple-state-management-from-scratch
import { reactive } from 'vue'

import Web3 from 'web3'
import RLogin from '@rsksmart/rlogin'
import WalletConnectProvider from '@walletconnect/web3-provider'

import { getNetworksAvailable, getNetworksConf } from '@/constants/networks.js'

import { ALL_RPC } from '@/constants/rpc.js'
import { convertToNumber } from '@/utils/text-helpers'

export const store = {
  state: reactive({
    web3: null,
    provider: null,
    dataVault: null,
    disconnect: null,
    // rLogin: rLogin,
    isConnected: false,
    accountAddress: '',
    currentConfig: null,
    chainId: null,
    rskWeb3: null,
    sideWeb3: null,
    rskConfig: null,
    sideConfig: null,
    connectionError: '',
  }),
  accountsChanged(accounts) {
    if (accounts.length === 0) {
      store.state.connectionError =
        'Nifty Wallet, Liquality or MetaMask is Locked, please unlock it and Reload the page to continue'
    }
    store.state.accountAddress = accounts[0]
  },
  initMainSettings(rskConfig, sideConfig) {
    const state = store.state
    state.rskConfig = rskConfig
    state.sideConfig = sideConfig
    state.rskWeb3 = new Web3(rskConfig.rpc)
    state.sideWeb3 = new Web3(sideConfig.rpc)
  },
  async chainChanged(chainId) {
    const state = store.state
    const parsedChainId = convertToNumber(chainId)
    state.chainId = parsedChainId
    const { rskConfig, sideConfig } = getNetworksConf(parsedChainId)
    store.initMainSettings(rskConfig, sideConfig)
    if (rskConfig.networkId == chainId) {
      state.currentConfig = state.rskConfig
    } else if (sideConfig.networkId == chainId) {
      state.currentConfig = state.sideConfig
    } else {
      state.isConnected = false
      state.connectionError = `Unknown network, should be ${rskConfig.name} or ${sideConfig.name} networks`
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
  getRLogin() {
    const supportedChains = [...new Set(getNetworksAvailable().map(network => network.networkId))]
    return new RLogin({
      cachedProvider: false,
      providerOptions: {
        walletconnect: {
          package: WalletConnectProvider,
          options: {
            rpc: ALL_RPC,
          },
        },
      },
      supportedChains,
    })
  },
  handleLogin() {
    const state = store.state
    state.connectionError = ''
    const rLoginInstance = store.getRLogin()
    return rLoginInstance
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
