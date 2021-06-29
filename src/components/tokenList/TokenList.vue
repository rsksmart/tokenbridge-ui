<template>
  <div id="tokensTab">
    <h2 class="subtitle">Token list</h2>
    <p class="text-center">
      Ethereum native tokens will transform into r(tokenName). RSK native tokens will transform into
      e(tokenName)
    </p>
    <div id="tokenListTab" class="align-center">
      <div class="header row mb-3 justify-content-center text-center">
        <div class="col-5">
          {{ sharedState.rskConfig.name }}
        </div>
        <div class="col-1"></div>
        <div class="col-5">
          {{ sharedState.ethConfig.name }}
        </div>
      </div>

      <TokenRow v-for="token in sharedState.tokens" :key="token.token" :token="token" />
    </div>
  </div>
</template>
<script>
import { store } from '@/store.js'
import TokenRow from './components/tokenRow/TokenRow.vue'

export default {
  name: 'TokenList',
  components: {
    TokenRow,
  },
  data() {
    return {
      sharedState: store.state,
    }
  },
}
</script>
