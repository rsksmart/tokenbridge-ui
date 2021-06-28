import { reactive } from 'vue'

import Web3 from 'web3'
import RLogin from '@rsksmart/rlogin'
import WalletConnectProvider from '@walletconnect/web3-provider'

const infuraKey = process.env.VUE_APP_INFURA_KEY
const rpcMainnet = {
  1: `https://mainnet.infura.io/v3/${infuraKey}`,
  30: 'https://public-node.rsk.co',
}
const supportedChainsMainnet = [1, 30]

const rpcTestnet = {
  42: `https://kovan.infura.io/v3/${infuraKey}`,
  31: 'https://public-node.testnet.rsk.co',
}
const supportedChainsTestnet = [42, 31]

const isTestnet = window.location.href.includes('testnet')

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
      })
      .catch(function(err) {
        console.error(err)
        throw new Error('Login failed. Please try again.')
      })
  },
}
