<template>
  <div class="multi-chain container p-5 mt-5">
    <div class="row justify-content-center">
      <template v-if="!sharedState.isConnected">
        <div class="col-12 text-center">
          <h4>To cross Token or NFT, is necessary to connect your wallet</h4>
        </div>
        <div class="col-12 text-center">
          <button
            id="logIn"
            type="button"
            class="btn btn-primary badge-pill"
            @click="connectWalletClick"
          >
            Connect Wallet
          </button>
        </div>
      </template>
      <template v-if="sharedState.preSettingsEnabled">
        <div class="col-12 text-center">
          <h4>
            You are connected with <span class="text-primary">{{ currentNetworkName }}</span>
          </h4>
        </div>
        <div class="col-12 text-center">
          <h4>Please, choose a destination network</h4>
        </div>
        <div class="col-4 text-center">
          <select id="networks" v-model="sideNetworkConfig" name="networks" class="form-control">
            <option value="" selected disabled>Please select a network</option>
            <option
              v-for="network in networks"
              :key="network.crossToNetwork.networkId"
              :value="network.crossToNetwork"
            >
              {{ network.crossToNetwork.name }}
            </option>
          </select>
        </div>
        <div class="col-3">
          <button class="btn btn-primary" @click="selectSideNetwork">Select Destination</button>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { store } from '@/store'

export default {
  name: 'MultiChain',
  data() {
    return {
      sharedState: store.state,
      sideNetworkConfig: '',
    }
  },
  computed: {
    networks() {
      return this.sharedState.networksAvailable
    },
    currentNetworkName() {
      return this.networks[0].name
    },
  },
  methods: {
    connectWalletClick() {
      return store.handleLogin()
    },
    selectSideNetwork() {
      const { crossToNetwork: hostNetwork } = this.sideNetworkConfig
      const rskConfig = this.sideNetworkConfig.isRsk ? this.sideNetworkConfig : hostNetwork
      const sideConfig = this.sideNetworkConfig.isRsk ? hostNetwork : this.sideNetworkConfig

      store.initMainSettings(hostNetwork.networkId, rskConfig, sideConfig)
    },
  },
}
</script>

<style scoped>
.multi-chain {
  border: 2px solid var(--primary);
  border-radius: 10px;
}
.multi-chain-btn {
  min-width: 10em;
}
</style>
