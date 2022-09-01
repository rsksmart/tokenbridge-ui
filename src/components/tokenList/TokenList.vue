<template>
  <div class="token-list main-div">
    <h2 id="token-list" class="subtitle">Token list</h2>
    <p class="text-center">
      {{ sharedState.sideConfig?.name || sharedState.defaultSideConfig.name }} native tokens will
      transform into
      {{
        sharedState.rskConfig?.tokenPrefix || sharedState.defaultRskConfig.tokenPrefix
      }}(tokenName). {{ sharedState.rskConfig?.name || sharedState.defaultRskConfig.name }} native
      tokens will transform into
      {{
        sharedState.sideConfig?.tokenPrefix || sharedState.defaultSideConfig.tokenPrefix
      }}(tokenName)
    </p>
    <table class="table">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">
            {{ sharedState.rskConfig?.name || sharedState.defaultRskConfig.name }}
          </th>
          <th scope="col">
            {{ sharedState.sideConfig?.name || sharedState.defaultSideConfig.name }}
          </th>
          <th scope="col">minimum</th>
          <th scope="col">maximum</th>
          <th scope="col">daily</th>
          <th scope="col">
            small <br />
            amount
          </th>
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
      <tbody v-if="tokenList.length > 0">
        <TokenRow
          v-for="token in tokenList"
          :key="token"
          :token="token"
          :types-limits="typesLimits"
        />
      </tbody>
    </table>
  </div>
</template>
<script>
import { store } from '@/store.js'
import TokenRow from './TokenRow.vue'

export default {
  name: 'TokenList',
  components: {
    TokenRow,
  },
  props: {
    typesLimits: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      sharedState: store.state,
      tokenList: [],
    }
  },
  created() {
    if (store.state.rskConfig) {
      this.tokenList = store.state.rskConfig.tokens
    } else {
      this.tokenList = store.state.defaultRskConfig.tokens
    }
  },
}
</script>
<style scoped>
.token-list .table thead th {
  vertical-align: middle;
}
</style>
