<template>
  <div>
    <section id="home">
      <div class="container">
        <Title />
        <FormWrapper
          :types-limits="typesLimits"
          :rsk-fee="rskFee"
          :eth-fee="ethFee"
          :rsk-confirmations="rskConfirmations"
          :eth-confirmations="ethConfirmations"
          @new-transaction="newTransaction = $event"
        />

        <Transactions
          :types-limits="typesLimits"
          :rsk-confirmations="rskConfirmations"
          :eth-confirmations="ethConfirmations"
          :rsk-fed-members="rskFedMembers"
          :eth-fed-members="ethFedMembers"
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

import 'popper.js'
import 'bootstrap'

import { retry3Times, blocksToTime } from '@/utils'

import Title from '@/components/title/Title.vue'
// import SearchTransaction from '@/components/transactions/SearchTransaction.vue'
import Transactions from '@/components/transactions/Transactions.vue'
import ImportantDetails from '@/components/importantDetails/ImportantDetails.vue'
import TokenList from '@/components/tokenList/TokenList.vue'
import { store } from '@/store.js'
import FormWrapper from '@/components/formWrapper/FormWrapper'

export default {
  name: 'Home',
  components: {
    FormWrapper,
    Title,
    ImportantDetails,
    TokenList,
    Transactions,
  },
  data() {
    return {
      sharedState: store.state,
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
    const sideWeb3 = this.sharedState.sideWeb3
    const sideConfig = this.sharedState.sideConfig

    const rskBridge = new rskWeb3.eth.Contract(BRIDGE_ABI, rskConfig.bridge)
    rskBridge.methods
      .getFeePercentage()
      .call()
      .then(fee => {
        data.rskFee = fee / rskConfig.feePercentageDivider
      })

    const ethBridge = new sideWeb3.eth.Contract(BRIDGE_ABI, sideConfig.bridge)
    retry3Times(ethBridge.methods.getFeePercentage().call).then(fee => {
      data.ethFee = fee / sideConfig.feePercentageDivider
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

    const ethAllowTokens = new sideWeb3.eth.Contract(ALLOW_TOKENS_ABI, sideConfig.allowTokens)
    retry3Times(ethAllowTokens.methods.getConfirmations().call).then(confirmations => {
      data.ethConfirmations = {
        smallAmount: confirmations.smallAmount,
        smallAmountTime: blocksToTime(confirmations.smallAmount, sideConfig.secondsPerBlock),
        mediumAmount: confirmations.mediumAmount,
        mediumAmountTime: blocksToTime(confirmations.mediumAmount, sideConfig.secondsPerBlock),
        largeAmount: confirmations.largeAmount,
        largeAmountTime: blocksToTime(confirmations.largeAmount, sideConfig.secondsPerBlock),
      }
    })

    const ethFederation = new sideWeb3.eth.Contract(FEDERATION_ABI, sideConfig.federation)
    retry3Times(ethFederation.methods.getMembers().call).then(
      members => (data.ethFedMembers = members),
    )
  },
}
</script>
