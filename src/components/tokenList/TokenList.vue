<template>
  <div class="token-list">
    <h2 class="subtitle">Token list</h2>
    <p class="text-center">
      Ethereum native tokens will transform into r(tokenName). RSK native tokens will transform into
      e(tokenName)
    </p>
    <table class="table">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">{{ sharedState.rskConfig.name }}</th>
          <th scope="col">{{ sharedState.ethConfig.name }}</th>
          <th scope="col">minimum</th>
          <th scope="col">maximum</th>
          <th scope="col">daily</th>
          <th scope="col">
            medium <br />
            amount
          </th>
          <th scope="col">
            large <br />
            amount
          </th>
        </tr>
      </thead>
      <tbody>
        <TokenRow
          v-for="token in sharedState.tokens"
          :key="token.token"
          :token="token"
          :types-limits="typesLimits"
        />
      </tbody>
    </table>
  </div>
</template>
<script>
import { store } from '@/store.js'
import TokenRow from './components/tokenRow/TokenRow.vue'
import ALLOW_TOKENS_ABI from '@/constants/abis/allowTokens.json'

export default {
  name: 'TokenList',
  components: {
    TokenRow,
  },
  data() {
    return {
      sharedState: store.state,
      typesLimits: [],
    }
  },
  created() {
    const data = this
    const rskWeb3 = this.sharedState.rskWeb3
    const rskConfig = this.sharedState.rskConfig
    const rskAllowTokens = new rskWeb3.eth.Contract(ALLOW_TOKENS_ABI, rskConfig.allowTokens)
    rskAllowTokens.methods
      .getTypesLimits()
      .call()
      .then(function(limits) {
        data.typesLimits = limits
      })
  },
}
</script>
<style scoped>
.token-list .table thead th {
  vertical-align: middle;
}
</style>
