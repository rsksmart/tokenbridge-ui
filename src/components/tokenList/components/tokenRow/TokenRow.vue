<template>
  <tr>
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
    <td>{{ mediumAmount }}</td>
    <td>{{ largeAmount }}</td>
  </tr>
</template>
<script>
import { store } from '@/store.js'
import Web3 from 'web3'

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
      return this.limits ? Web3.utils.fromWei(this.limits.min) : ''
    },
    max() {
      return this.limits ? Web3.utils.fromWei(this.limits.max) : ''
    },
    daily() {
      return this.limits ? Web3.utils.fromWei(this.limits.daily) : ''
    },
    mediumAmount() {
      return this.limits ? Web3.utils.fromWei(this.limits.mediumAmount) : ''
    },
    largeAmount() {
      return this.limits ? Web3.utils.fromWei(this.limits.largeAmount) : ''
    },
  },
}
</script>
