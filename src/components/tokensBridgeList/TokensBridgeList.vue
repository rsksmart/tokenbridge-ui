<template>
  <div id="tokensTab">
    <h5 class="subtitle">Token bridge list</h5>
    <p class="text-center">
      Ethereum native tokens will transform into r(tokenName). RSK native tokens will transform into
      e(tokenName)
    </p>
    <div id="tokenListTab" class="align-center">
      <TokenRow v-for="token in tokens" :token="token" />
    </div>
  </div>
</template>
<script>
import { TOKENS } from '@/constants'
import TokenRow from './components/tokenRow/TokenRow.vue'

export default {
  name: 'TokensBridgeList',
  components: {
    TokenRow,
  },
  data() {
    return {
      tokens: TOKENS,
    }
  },
}
</script>
