<template>
  <header>
    <!-- Navigation -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="w-100">
        <div class="row w-100">
          <div class="col-4 offset-8 d-flex justify-content-end">
            <div
              v-if="isConnected"
              class="wallet-status navbar-item indicator badge-outline badge-pill"
            >
              <span aria-describedby="tooltip-status" class="fromNetwork">
                {{ sharedState.currentConfig.name }}
              </span>
            </div>
            <div
              v-if="isConnected"
              class="wallet-status navbar-item badge-pill text-truncate"
              style="width: 155px;"
            >
              <span id="address">{{ sharedState.accountAddress }}</span>
            </div>
          </div>
          <div
            v-if="!sharedState.isConnected"
            id="navbarResponsive"
            class="navbar-collapse collapse"
          >
            <div class="navbar-item ml-auto">
              <button
                id="logIn"
                type="button"
                class="btn btn-primary badge-pill"
                @click="connectWalletClick"
              >
                Connect wallet
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<script>
import { store } from '@/store.js'

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
  },
  methods: {
    connectWalletClick() {
      return store.handleLogin()
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
