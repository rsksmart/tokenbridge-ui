<template>
  <!-- Navigation -->
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container">
      <div class="col-2">
        <a class="navbar-brand" href="https://rsk.co">
          <img
            id="logo"
            src="../../assets/img/bridge-logo.png"
            class="logo"
            alt="RSK Token Bridge"
          />
        </a>
      </div>
      <div v-if="isConnected" class="wallet-status navbar-item indicator badge-outline badge-pill">
        <span aria-describedby="tooltip-status" class="fromNetwork">
          {{ sharedState.currentConfig.name }}
        </span>
      </div>
      <button
        class="navbar-toggler collapsed"
        type="button"
        data-toggle="collapse"
        data-target="#navbarResponsive"
        aria-controls="navbarResponsive"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div id="navbarResponsive" class="navbar-collapse collapse">
        <div
          v-if="isConnected"
          class="wallet-status navbar-item badge-pill text-truncate"
          style="width: 85px;"
        >
          <span id="address">{{ sharedState.accountAddress }}</span>
        </div>
        <div v-if="isConnected" class="d-flex align-items-center navbar-item">
          <span class="input-group-text mr-2 bg-transparent text-primary border-0">
            <i class="fas fa-long-arrow-alt-right"></i>
          </span>
          <select
            v-if="networks.length > 0"
            id="networks"
            v-model="sideConfig"
            name="networks"
            class="form-control select-networks"
            @change="changeSideNetwork"
          >
            <option value="" selected disabled>Destination network</option>
            <option
              v-for="network in networks"
              :key="network.crossToNetwork.networkId"
              :value="network.crossToNetwork"
            >
              {{ network.crossToNetwork.name }}
            </option>
          </select>
          <div v-else class="wallet-status indicator badge-outline badge-pill">
            {{ sharedState.currentConfig.crossToNetwork.name }}
          </div>
          <button
            type="button"
            v-if="isMetaMask"
            class="btn btn-link btn-sm text-primary"
            @click="handleSwitchNetwork"
          >
            Switch Network
          </button>
        </div>
        <div class="navbar-item ml-auto">
          <button
            v-if="!sharedState.isConnected"
            id="logIn"
            type="button"
            class="btn btn-primary badge-pill"
            @click="connectWalletClick"
          >
            Connect wallet
          </button>
          <a v-if="isConnected" id="help" href="https://developers.rsk.co/slack/">
            Do you need help?
          </a>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { store } from '@/store.js'
import { numToHex } from '@/utils/helpers'

export default {
  name: 'NavBar',
  data() {
    return {
      sharedState: store.state,
      sideNetworkConfig: null,
    }
  },
  computed: {
    sideConfig: {
      get: function() {
        return store.state.sideConfig
      },
      set: function(value) {
        this.sideNetworkConfig = value
      },
    },
    networks() {
      return this.sharedState.networksAvailable
    },
    isConnected() {
      return this.sharedState.isConnected && !this.sharedState.preSettingsEnabled
    },
    isMetaMask() {
      return window.ethereum.isMetaMask
    },
  },
  methods: {
    connectWalletClick() {
      return store.handleLogin()
    },
    async handleAddNetwork(networkConfig) {
      try {
        const chainId = numToHex(networkConfig.networkId)
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId,
              chainName: networkConfig.name,
              nativeCurrency: {
                name: networkConfig.mainToken.name,
                symbol: networkConfig.mainToken.symbol,
                decimals: networkConfig.mainToken.decimals,
              },
              rpcUrls: [networkConfig.rpc],
            },
          ],
        })
      } catch (error) {
        console.error(error)
      }
    },
    async handleSwitchNetwork() {
      try {
        const chainId = numToHex(this.sharedState.currentConfig.crossToNetwork.networkId)
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId }],
        })
      } catch (error) {
        if (error.code === 4902) {
          await this.handleAddNetwork(this.sharedState.currentConfig.crossToNetwork)
        }
      }
    },
    changeSideNetwork() {
      const { crossToNetwork: hostNetwork } = this.sideNetworkConfig
      store.state.isConnected = false
      const rskConfig = this.sideNetworkConfig.isRsk ? this.sideNetworkConfig : hostNetwork
      const sideConfig = this.sideNetworkConfig.isRsk ? hostNetwork : this.sideNetworkConfig

      store.initMainSettings(hostNetwork.networkId, rskConfig, sideConfig)
    },
  },
}
</script>

<style scoped>
.select-networks {
  border-radius: 20px;
  border-color: var(--primary);
  color: var(--primary);
  outline: none;
  width: 260px;
}
.select-networks:focus {
  outline: none;
}
</style>
