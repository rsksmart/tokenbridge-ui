<template>
  <div>
    <section id="home">
      <div class="container">
        <Title :is-testnet="isTestnet" />

        <CrossForm
          :types-limits="typesLimits"
          :rsk-fee="rskFee"
          :eth-fee="ethFee"
          :rsk-confirmations="rskConfirmations"
          :eth-confirmations="ethConfirmations"
          @new-transaction="newTransaction = $event"
        />

        <TransactionList
          :types-limits="typesLimits"
          :rsk-confirmations="rskConfirmations"
          :eth-confirmations="ethConfirmations"
          :fed-members-len="rskFedMembers.length"
          :new-transaction="newTransaction"
        />

        <ImportantDetails
          :rsk-fee="rskFee"
          :eth-fee="ethFee"
          :rsk-confirmations="rskConfirmations"
          :eth-confirmations="ethConfirmations"
          :rsk-fed-members="rskFedMembers"
          :eth-fed-members="ethFedMembers"
        />

        <TokenList :types-limits="typesLimits" />
      </div>
      <!--- End Tab Content -->
    </section>
  </div>
</template>

<script>
// --------- import TOKENS and network CONFIG  --------------

// ------ ABIS -----
import BRIDGE_ABI from '@/constants/abis/bridge.json'
import ALLOW_TOKENS_ABI from '@/constants/abis/allowTokens.json'
import FEDERATION_ABI from '@/constants/abis/federation.json'

import $ from 'jquery'
import 'popper.js'
import 'bootstrap'

import { retry3Times, blocksToTime } from '@/utils'

import CrossForm from '@/components/crossForm/CrossForm.vue'
import Title from '@/components/title/Title.vue'
import TransactionList from '@/components/transactionList/TransactionList.vue'
import ImportantDetails from '@/components/importantDetails/ImportantDetails.vue'
import TokenList from '@/components/tokenList/TokenList.vue'
import { store } from '@/store.js'

export default {
  name: 'Home',
  components: {
    Title,
    CrossForm,
    ImportantDetails,
    TokenList,
    TransactionList,
  },
  data() {
    return {
      sharedState: store.state,
      isTestnet: false,
      typesLimits: [],
      rskFee: 0,
      ethFee: 0,
      rskConfirmations: {},
      ethConfirmations: {},
      rskFedMembers: [],
      ethFedMembers: [],
      newTransaction: null,
    }
  },
  created() {
    const data = this
    const rskWeb3 = this.sharedState.rskWeb3
    const rskConfig = this.sharedState.rskConfig
    const ethWeb3 = this.sharedState.ethWeb3
    const ethConfig = this.sharedState.ethConfig

    const rskBridge = new rskWeb3.eth.Contract(BRIDGE_ABI, rskConfig.bridge)
    rskBridge.methods
      .getFeePercentage()
      .call()
      .then(fee => {
        data.rskFee = fee / rskConfig.feePercentageDivider
      })

    const ethBridge = new ethWeb3.eth.Contract(BRIDGE_ABI, ethConfig.bridge)
    retry3Times(ethBridge.methods.getFeePercentage().call).then(fee => {
      data.ethFee = fee / ethConfig.feePercentageDivider
    })
    // We have the premice that the limits will be equal in ETH and in RSK
    // And the tokens wil have the same type on both networks
    const rskAllowTokens = new rskWeb3.eth.Contract(ALLOW_TOKENS_ABI, rskConfig.allowTokens)
    retry3Times(rskAllowTokens.methods.getTypesLimits().call).then(limits => {
      data.typesLimits = limits
    })

    retry3Times(rskAllowTokens.methods.getConfirmations().call).then(confirmations => {
      data.rskConfirmations = {
        smallAmount: confirmations.smallAmount,
        smallAmountTime: blocksToTime(confirmations.smallAmount, rskConfig.secondsPerBlock),
        mediumAmount: confirmations.mediumAmount,
        mediumAmountTime: blocksToTime(confirmations.mediumAmount, rskConfig.secondsPerBlock),
        largeAmount: confirmations.largeAmount,
        largeAmountTime: blocksToTime(confirmations.largeAmount, rskConfig.secondsPerBlock),
      }
    })

    const rskFederation = new rskWeb3.eth.Contract(FEDERATION_ABI, rskConfig.federation)
    retry3Times(rskFederation.methods.getMembers().call).then(
      members => (data.rskFedMembers = members),
    )

    const ethAllowTokens = new ethWeb3.eth.Contract(ALLOW_TOKENS_ABI, ethConfig.allowTokens)
    retry3Times(ethAllowTokens.methods.getConfirmations().call).then(confirmations => {
      data.ethConfirmations = {
        smallAmount: confirmations.smallAmount,
        smallAmountTime: blocksToTime(confirmations.smallAmount, ethConfig.secondsPerBlock),
        mediumAmount: confirmations.mediumAmount,
        mediumAmountTime: blocksToTime(confirmations.mediumAmount, ethConfig.secondsPerBlock),
        largeAmount: confirmations.largeAmount,
        largeAmountTime: blocksToTime(confirmations.largeAmount, ethConfig.secondsPerBlock),
      }
    })

    const ethFederation = new ethWeb3.eth.Contract(FEDERATION_ABI, ethConfig.federation)
    retry3Times(ethFederation.methods.getMembers().call).then(
      members => (data.ethFedMembers = members),
    )
  },
}
</script>
