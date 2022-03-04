<template>
  <TokenList v-if="displayList" :types-limits="settings.typesLimits" />
  <div v-else>
    <h5 class="subtitle">No active account, please connect your wallet</h5>
  </div>
</template>

<script>
import TokenList from '@/components/tokenList/TokenList'
import { store } from '@/store'
import globalStore from '@/stores/global.store'
import { TOKEN_TYPE_ERC_20 } from '@/constants/tokenType'

export default {
  name: 'TokenListPage',
  components: { TokenList },
  data() {
    return {
      globalState: globalStore.state,
      sharedState: store.state,
    }
  },
  computed: {
    settings() {
      return this.sharedState.networkSettings
    },
    displayList() {
      return (
        this.globalState.currentTokenType === TOKEN_TYPE_ERC_20 &&
        this.sharedState.rskConfig?.tokens.length > 0
      )
    },
  },
}
</script>

<style scoped></style>
