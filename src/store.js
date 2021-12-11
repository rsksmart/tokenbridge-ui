// Store pattern https://v3.vuejs.org/guide/state-management.html#simple-state-management-from-scratch
import { reactive } from 'vue'

import Web3 from 'web3'
import RLogin from '@rsksmart/rlogin'
import WalletConnectProvider from '@walletconnect/web3-provider'

import { getNetworksAvailable, getNetworksConf } from '@/constants/networks.js'

import { ALL_RPC } from '@/constants/rpc.js'
import { convertToNumber } from '@/utils/text-helpers'
import SideNetwork from '@/modules/networks/SideNetwork'
import HostNetwork from '@/modules/networks/HostNetwork'
import { blocksToTime } from '@/utils'

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
    networksAvailable: [],
    preSettingsEnabled: false,
    networkSettings: {
      typesLimits: [],
      rskFee: 0,
      sideFee: 0,
      rskFeeNft: 0,
      sideFeeNft: 0,
      rskConfirmations: {},
      sideConfirmations: {},
      rskConfirmationsNft: {},
      sideConfirmationsNft: {},
      rskFedMembers: [],
      sideFedMembers: [],
    },
  }),
  accountsChanged(accounts) {
    if (accounts.length === 0) {
      store.state.connectionError =
        'Nifty Wallet, Liquality or MetaMask is Locked, please unlock it and Reload the page to continue'
    }
    store.state.accountAddress = accounts[0]
  },
  async initNetworkSettings() {
    const rskWeb3 = store.state.rskWeb3
    const rskConfig = store.state.rskConfig
    const sideWeb3 = store.state.sideWeb3
    const sideConfig = store.state.sideConfig

    const sideNetwork = new SideNetwork(sideConfig, sideWeb3)
    const hostNetwork = new HostNetwork(rskConfig, rskWeb3)
    const networkSettings = {}
    networkSettings.rskFee = await hostNetwork.getFeePercentage()

    networkSettings.sideFee = await sideNetwork.getFeePercentage()
    // We have the premice that the limits will be equal in Side and in RSK
    // And the tokens wil have the same type on both networks
    const { limits, confirmations } = await hostNetwork.allowTokensActions()
    networkSettings.typesLimits = limits
    networkSettings.rskConfirmations = confirmations
    networkSettings.rskFedMembers = await hostNetwork.getMembers()

    const { confirmations: sideConfirmations } = await sideNetwork.allowTokensActions()
    networkSettings.sideConfirmations = sideConfirmations

    networkSettings.sideFedMembers = await sideNetwork.getMembers()

    // NFT
    if (!rskConfig.nftBridge || !sideConfig.nftBridge) {
      return
    }
    networkSettings.rskFeeNft = await hostNetwork.getFixedFee()

    networkSettings.sideFeeNft = await sideNetwork.getFixedFee()

    const NFT_FIXED_CONFIRMATIONS_BLOCK = 3 // maybe we are going to define it into the nft bridge contract

    networkSettings.rskConfirmationsNft = {
      confirmations: NFT_FIXED_CONFIRMATIONS_BLOCK,
      time: blocksToTime(NFT_FIXED_CONFIRMATIONS_BLOCK, rskConfig.secondsPerBlock),
    }
    networkSettings.sideConfirmationsNft = {
      confirmations: NFT_FIXED_CONFIRMATIONS_BLOCK,
      time: blocksToTime(NFT_FIXED_CONFIRMATIONS_BLOCK, sideConfig.secondsPerBlock),
    }
    this.networkSettings = networkSettings
  },
  async initMainSettings(chainId, rskConfig, sideConfig) {
    const state = store.state
    state.chainId = chainId
    state.rskConfig = rskConfig
    state.sideConfig = sideConfig
    state.rskWeb3 = new Web3(rskConfig.rpc)
    state.sideWeb3 = new Web3(sideConfig.rpc)
    state.isConnected = true
    state.preSettingsEnabled = false
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
      await this.initNetworkSettings()
    }
  },
  async chainChanged(chainId) {
    const state = store.state
    state.preSettingsEnabled = false
    state.networksAvailable = []
    const parsedChainId = convertToNumber(chainId)
    const { rskConfig, sideConfig, networks } = getNetworksConf(parsedChainId, state.chainId)
    state.rskConfig = rskConfig
    state.sideConfig = sideConfig
    if (rskConfig && sideConfig && !networks) {
      await store.initMainSettings(parsedChainId, rskConfig, sideConfig)
    } else if (networks.length > 1) {
      state.preSettingsEnabled = true
      state.networksAvailable = networks
      await store.initMainSettings(parsedChainId, rskConfig, sideConfig)
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
        state.provider.on('chainChanged', (...params) => {
          store.isConnected = false
          store.chainChanged(...params)
        })
        state.provider.on('accountsChanged', (...params) => {
          store.isConnected = false
          store.accountsChanged(...params)
        })
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
