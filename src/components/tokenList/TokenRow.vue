<template>
  <tr class="token-row">
    <th scope="row"><img :src="token.icon" class="token-logo" /></th>
    <td>
      <a :href="rskExplorerUrl" target="_blank">{{ token[rskNetworkId].symbol }}</a>
      <a class="float-right mr-3" href="#" @click="copyRskTransactionHash">
        <i :class="copyRskIcon"></i>
      </a>
    </td>
    <td>
      <a :href="ethExplorerUrl" target="_blank">{{ token[ethNetworkId].symbol }}</a>
      <a class="float-right mr-3" href="#" @click="copyEthTransactionHash">
        <i :class="copyEthIcon"></i>
      </a>
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
const DEFAULT_COPY_ICON = 'far fa-clipboard'

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
      copyEthIcon: DEFAULT_COPY_ICON,
      copyRskIcon: DEFAULT_COPY_ICON,
    }
  },
  computed: {
    rskExplorerUrl() {
      return `${this.sharedState.rskConfig.explorer}/address/${this.rskTokenAddress}`
    },
    rskTokenAddress() {
      return this.token[this.sharedState.rskConfig.networkId].address.toLowerCase()
    },
    ethExplorerUrl() {
      return `${this.sharedState.ethConfig.explorer}/address/${this.ethTokenAddress}`
    },
    ethTokenAddress() {
      return this.token[this.sharedState.ethConfig.networkId].address.toLowerCase()
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
  methods: {
    async copyTransactionHash(event, address, dataParam) {
      event.preventDefault()
      await navigator.clipboard.writeText(address)
      this[dataParam] = 'fas fa-clipboard-check'
      setTimeout(() => {
        this.[dataParam] = DEFAULT_COPY_ICON
      }, 1000)
    },
    async copyRskTransactionHash(event) {
      return this.copyTransactionHash(event, this.rskTokenAddress, 'copyRskIcon')
    },
    async copyEthTransactionHash(event) {
      return this.copyTransactionHash(event, this.ethTokenAddress, 'copyEthIcon')
    },
  },
}
</script>
