<template>
  <div class="row mb-3 justify-content-center">
    <div class="col-5 row">
      <div class="col-8 font-weight-bold">
        <a :href="rskExplorerUrl" target="_blank">
          <span><img :src="token.icon" class="token-logo"/></span>
          {{ token[sharedState.rskConfig.networkId].symbol }}
        </a>
      </div>
      <div class="col-4">
        <button
          class="copy btn btn-outline-secondary"
          type="button"
          :data-clipboard-text="token.address"
          data-toggle="tooltip"
          data-placement="bottom"
          title="Copy token address to clipboard"
        >
          <i class="far fa-copy"></i>
        </button>
      </div>
    </div>
    <div class="col-2 text-center">
      <i class="fas fa-arrows-alt-h"></i>
    </div>
    <div class="col-5 row">
      <div class="col-8 font-weight-bold">
        <a :href="ethExplorerUrl" target="_blank">
          <span><img :src="token.icon" class="token-logo"/></span>
          {{ token[sharedState.ethConfig.networkId].symbol }}
        </a>
      </div>
      <div class="col-4">
        <button
          class="copy btn btn-outline-secondary"
          type="button"
          :data-clipboard-text="token.crossAddress"
          data-toggle="tooltip"
          data-placement="bottom"
          title="Copy the address"
        >
          <i class="far fa-copy"></i>
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import { store } from '@/store.js'

export default {
  name: 'TokenRow',
  props: {
    token: {
      type: Object,
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
  },
}
// function updateTokenListTab() {
//       let rskConfig = RSK_TESTNET_CONFIG
//       if (!vNode.sharedState.isTestnet) rskConfig = RSK_MAINNET_CONFIG

//       let tabHtml = `<div class="row mb-3 justify-content-center text-center">`
//       tabHtml += `\n    <div class="col-5">`
//       tabHtml += `\n        ${rskConfig.name}`
//       tabHtml += `\n    </div>`
//       tabHtml += `\n    <div class="col-1"></div>`
//       tabHtml += `\n    <div class="col-5">`
//       tabHtml += `\n        ${rskConfig.crossToNetwork.name}`
//       tabHtml += `\n    </div>`
//       tabHtml += `\n</div>`
//       for (let aToken of TOKENS) {
//         if (aToken[rskConfig.networkId] != undefined) {
//           tabHtml += `\n<div class="row mb-3 justify-content-center">`
//           tabHtml += `\n    <div class="col-5 row">`
//           tabHtml += `\n      <div class="col-8 font-weight-bold">`
//           tabHtml += `\n          <a href="${rskConfig.explorer}/address/${aToken[
//             rskConfig.networkId
//           ].address.toLowerCase()}" class="address" target="_blank">`
//           tabHtml += `\n            <span><img src="${aToken.icon}" class="token-logo"></span>${
//             aToken[rskConfig.networkId].symbol
//           }`
//           tabHtml += `\n          </a>`
//           tabHtml += `\n       </div>`
//           tabHtml += `\n       <div class="col-4">`
//           tabHtml += `\n           <button class="copy btn btn-outline-secondary" type="button" data-clipboard-text="${aToken[
//             rskConfig.networkId
//           ].address.toLowerCase()}" data-toggle="tooltip" data-placement="bottom" title="Copy token address to clipboard">`
//           tabHtml += `\n                <i class="far fa-copy"></i>`
//           tabHtml += `\n           </button>`
//           tabHtml += `\n       </div>`
//           tabHtml += `\n    </div>`
//           tabHtml += `\n    <div class="col-2 text-center">`
//           tabHtml += `\n        <i class="fas fa-arrows-alt-h"></i>`
//           tabHtml += `\n    </div>`
//           tabHtml += `\n    <div class="col-5 row">`
//           tabHtml += `\n      <div class="col-8 font-weight-bold">`
//           tabHtml += `\n          <a href="${rskConfig.crossToNetwork.explorer}/address/${aToken[
//             rskConfig.crossToNetwork.networkId
//           ].address.toLowerCase()}" class="address" target="_blank">`
//           tabHtml += `\n              <span><img src="${aToken.icon}" class="token-logo"></span>${
//             aToken[rskConfig.crossToNetwork.networkId].symbol
//           }`
//           tabHtml += `\n          </a>`
//           tabHtml += `\n      </div>`
//           tabHtml += `\n      <div class="col-4">`
//           tabHtml += `\n          <button class="copy btn btn-outline-secondary" type="button" data-clipboard-text="${aToken[
//             rskConfig.crossToNetwork.networkId
//           ].address.toLowerCase()}" data-toggle="tooltip" data-placement="bottom" title="Copy the address">`
//           tabHtml += `\n              <i class="far fa-copy"></i>`
//           tabHtml += `\n          </button>`
//           tabHtml += `\n      </div>`
//           tabHtml += `\n    </div>`
//           tabHtml += `\n</div>`
//         }
//       }
//       $('#tokenListTab').html(tabHtml)
//     }
</script>
