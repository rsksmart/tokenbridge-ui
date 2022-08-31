<template>
  <TokenList v-if="displayList" :types-limits="settings.typesLimits" />
  <div v-else>
    <h5 class="subtitle">No active account, please connect your wallet</h5>
  </div>
</template>

<script>
import TokenList from '@/components/tokenList/TokenList'
import { store } from '@/store'

export default {
  name: 'TokenListPage',
  components: { TokenList },
  data() {
    return {
      sharedState: store.state,
    }
  },
  computed: {
    settings() {
      let network

      if (this.sharedState.networkSettings.typesLimits.length === 0) {
        network = this.sharedState.defaultNetworkSettings
      } else {
        network = this.sharedState.networkSettings
      }

      return network
    },
    displayList() {
      return (
        this.sharedState.rskConfig?.tokens.length > 0 ||
        this.sharedState.defaultRskConfig.tokens.length > 0
      )
    },
  },
  async created() {
    await store.initDefaultNetworkSettings()
  },
}
</script>

<style scoped></style>
