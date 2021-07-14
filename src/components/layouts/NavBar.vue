<template>
  <!-- Navigation -->
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container">
      <a class="navbar-brand" href="https://rsk.co">
        <img
          id="logo"
          src="https://developers.rsk.co/assets/img/rsk_logo.svg"
          class="logo"
          alt="RSK Token Bridge"
        />
      </a>
      <div
        v-if="sharedState.isConnected"
        class="wallet-status navbar-item indicator badge-outline badge-pill"
      >
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
          v-if="sharedState.isConnected"
          class="wallet-status navbar-item badge-pill text-truncate"
          style="width: 85px;"
        >
          <span id="address">{{ sharedState.accountAddress }}</span>
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
          <a v-if="sharedState.isConnected" id="help" href="https://developers.rsk.co/slack/">
            Do you need help?
          </a>
        </div>
      </div>
    </div>
  </nav>
  <Modal v-if="sharedState.connectionError" @close="sharedState.connectionError = ''">
    <template #title>
      Connection Error
    </template>
    <template #body>
      <p>{{ sharedState.connectionError }}</p>
    </template>
  </Modal>
</template>

<script>
import { store } from '@/store.js'
import Modal from '@/components/commons/Modal.vue'

export default {
  name: 'NavBar',
  components: {
    Modal,
  },
  data() {
    return {
      sharedState: store.state,
    }
  },
  methods: {
    connectWalletClick() {
      return store.handleLogin()
    },
  },
}
</script>
