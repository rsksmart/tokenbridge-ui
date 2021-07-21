<template>
  <tr class="token-row">
    <th scope="row"><img :src="token.icon" class="token-logo" /></th>
    <td>
      <a :href="rskExplorerUrl" target="_blank">{{ token[rskNetworkId].symbol }}</a>
    </td>
    <td>
      <a :href="ethExplorerUrl" target="_blank">{{ token[ethNetworkId].symbol }}</a>
    </td>
    <td>{{ min }}</td>
    <td>{{ max }}</td>
    <td>{{ daily }}</td>
    <td>&lt; {{ mediumAmount }}</td>
    <td>&ge; {{ mediumAmount }} &lt; {{ largeAmount }}</td>
    <td>&ge; {{ largeAmount }}</td>
  </tr>
</template>
<script>
import { store } from '@/store.js'
import BigNumber from 'bignumber.js'

function weiToFormat(value) {
  return value ? new BigNumber(value).shiftedBy(-18).toFormat() : ''
}

export default {
  name: 'TokenRow',
  props: {
    token: {
      type: Object,
      required: true,
    },
    typesLimits: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      sharedState: store.state,
    }
  },
  computed: {
    rskExplorerUrl() {
      return `${this.sharedState.rskConfig.explorer}/address/${this.token[
        this.sharedState.rskConfig.networkId
      ].address.toLowerCase()}`
    },
    ethExplorerUrl() {
      return `${this.sharedState.ethConfig.explorer}/address/${this.token[
        this.sharedState.ethConfig.networkId
      ].address.toLowerCase()}`
    },
    rskNetworkId() {
      return this.sharedState.rskConfig.networkId
    },
    ethNetworkId() {
      return this.sharedState.ethConfig.networkId
    },
    limits() {
      return this.typesLimits[this.token.typeId]
    },
    min() {
      return weiToFormat(this.limits?.min)
    },
    max() {
      return weiToFormat(this.limits?.max)
    },
    daily() {
      return weiToFormat(this.limits?.daily)
    },
    mediumAmount() {
      return weiToFormat(this.limits?.mediumAmount)
    },
    largeAmount() {
      return weiToFormat(this.limits?.largeAmount)
    },
  },
}
</script>
