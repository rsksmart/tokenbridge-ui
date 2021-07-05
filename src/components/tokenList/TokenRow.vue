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
    <td>&ge; {{ min }} &lt; {{ mediumAmount }}</td>
    <td>&ge; {{ mediumAmount }} &lt; {{ largeAmount }}</td>
    <td>&ge; {{ largeAmount }}</td>
  </tr>
</template>
<script>
import { store } from '@/store.js'
import Web3 from 'web3'

function weiToLocalString(value) {
  return value ? Number(Web3.utils.fromWei(value)).toLocaleString() : ''
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
      return weiToLocalString(this.limits?.min)
    },
    max() {
      return weiToLocalString(this.limits?.max)
    },
    daily() {
      return weiToLocalString(this.limits?.daily)
    },
    mediumAmount() {
      return weiToLocalString(this.limits?.mediumAmount)
    },
    largeAmount() {
      return weiToLocalString(this.limits?.largeAmount)
    },
  },
}
</script>
