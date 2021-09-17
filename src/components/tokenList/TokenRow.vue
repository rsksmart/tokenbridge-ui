<template>
  <tr class="token-row">
    <th scope="row"><img :src="token.icon" class="token-logo" /></th>
    <td>
      <a :href="rskExplorerUrl" target="_blank">{{ token.symbol }}</a>
      <a class="float-right mr-3" href="#" @click="copyRskTransactionHash">
        <i :class="copyRskIcon"></i>
      </a>
    </td>
    <td>
      <a :href="sideExplorerUrl" target="_blank">{{ token.receiveToken.symbol }}</a>
      <a class="float-right mr-3" href="#" @click="copySideTransactionHash">
        <i :class="copySideIcon"></i>
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
      copySideIcon: DEFAULT_COPY_ICON,
      copyRskIcon: DEFAULT_COPY_ICON,
    }
  },
  computed: {
    rskExplorerUrl() {
      return `${this.sharedState.rskConfig.explorer}/address/${this.rskTokenAddress}`
    },
    rskTokenAddress() {
      return this.token.address.toLowerCase()
    },
    sideExplorerUrl() {
      return `${this.sharedState.sideConfig.explorer}/address/${this.sideTokenAddress}`
    },
    sideTokenAddress() {
      return this.token.receiveToken.address.toLowerCase()
    },
    rskNetworkId() {
      return this.sharedState.rskConfig.networkId
    },
    ethNetworkId() {
      return this.sharedState.sideConfig.networkId
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
    async copySideTransactionHash(event) {
      return this.copyTransactionHash(event, this.sideTokenAddress, 'copySideIcon')
    },
  },
}
</script>
