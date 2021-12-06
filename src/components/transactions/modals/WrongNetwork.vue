<template>
  <div class="bg-white p-2 rounded-sm">
    <div class="modal-header">
      <h4 class="m-0"><i class="fas fa-exclamation-triangle text-warning"></i> Wrong Network</h4>
    </div>
    <div class="modal-body">
      <p>To claim this tokens you need to connect your wallet to {{ networkConfig.name }}</p>
      <p v-if="errorMessage" class="text-danger">{{ errorMessage }}</p>
      <div class="mt-4 text-center">
        <button class="btn btn-primary mx-2" :disabled="loading" @click="handleSwitchNetwork">
          <span
            v-if="loading"
            class="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
          ></span>
          Change to {{ networkConfig.name }}
        </button>
        <button class="btn btn-info mx-2" :disabled="loading" @click="handleKeepCurrentNetwork">
          <span
            v-if="loading"
            class="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
          ></span>
          Keep in {{ networkConfig.crossToNetwork.name }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { numToHex } from '@/utils/helpers'
import { store } from '@/store'

export default {
  name: 'WrongNetwork',
  props: {
    networkConfig: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      sharedState: store.state,
      loading: false,
      errorMessage: '',
    }
  },
  methods: {
    handleKeepCurrentNetwork() {
      this.$parent.handleCloseModal()
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
        this.loading = false
        this.$parent.handleCloseModal()
      } catch (error) {
        this.loading = false
        this.errorMessage = error.message
      }
    },
    async handleSwitchNetwork() {
      this.loading = true
      this.errorMessage = ''
      try {
        const chainId = numToHex(this.networkConfig.networkId)
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId }],
        })
        this.loading = false
        this.$parent.handleCloseModal()
      } catch (error) {
        if (error.code === 4902) {
          await this.handleAddNetwork(this.networkConfig)
        } else {
          this.loading = false
          this.errorMessage = error.message
        }
      }
    },
  },
}
</script>

<style scoped></style>
