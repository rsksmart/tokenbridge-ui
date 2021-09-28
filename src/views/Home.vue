<template>
  <div>
    <section id="home">
      <div class="container">
        <Title />
        <FormWrapper
          :types-limits="typesLimits"
          :rsk-fee="rskFee"
          :side-fee="sideFee"
          :rsk-confirmations="rskConfirmations"
          :side-confirmations="sideConfirmations"
          @new-transaction="newTransaction = $event"
        />

        <Transactions
          :types-limits="typesLimits"
          :rsk-confirmations="rskConfirmations"
          :side-confirmations="sideConfirmations"
          :rsk-fed-members="rskFedMembers"
          :side-fed-members="sideFedMembers"
          :new-transaction="newTransaction"
        />

        <ImportantDetails
          v-if="globalState.actualTokenType == tokenTypeErc20"
          :rsk-fee="rskFee"
          :side-fee="sideFee"
          :rsk-confirmations="rskConfirmations"
          :side-confirmations="sideConfirmations"
          :rsk-fed-members="rskFedMembers"
          :side-fed-members="sideFedMembers"
        />

        <TokenList
          v-if="globalState.currentTokenType == tokenTypeErc20"
          :types-limits="typesLimits"
        />
      </div>
      <!--- End Tab Content -->
    </section>
  </div>
</template>

<script>
// --------- import TOKENS and network CONFIG --------------

// ------ ABIS -----
import BRIDGE_ABI from '@/constants/abis/bridge.json'
import ALLOW_TOKENS_ABI from '@/constants/abis/allowTokens.json'
import FEDERATION_ABI from '@/constants/abis/federation.json'
import { TOKEN_TYPE_ERC_20, TOKEN_TYPE_ERC_721 } from '@/constants/tokenType.js'

import 'popper.js'
import 'bootstrap'

import { retry3Times, blocksToTime } from '@/utils'

import Title from '@/components/title/Title.vue'
// import SearchTransaction from '@/components/transactions/SearchTransaction.vue'
import Transactions from '@/components/transactions/Transactions.vue'
import ImportantDetails from '@/components/importantDetails/ImportantDetails.vue'
import TokenList from '@/components/tokenList/TokenList.vue'
import { store } from '@/store.js'
import globalStore from '@/stores/global.store'
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
      sideFee: 0,
      rskConfirmations: {},
      sideConfirmations: {},
      rskConfirmationsNft: {},
      sideConfirmationsNft: {},
      rskFedMembers: [],
      sideFedMembers: [],
      newTransaction: null,
      globalState: globalStore.state,
      tokenTypeErc20: TOKEN_TYPE_ERC_20,
    }
  },
  created() {
    switch (this.globalState.actualTokenType) {
      case TOKEN_TYPE_ERC_721:
        break

      default:
        this.createdErc20()
        break
    }
  },
  createdErc20() {
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
      .catch(err => {
        // eslint-disable-next-line no-console
        console.log('Error in getFeePercentage', err)
      })

    const ethBridge = new sideWeb3.eth.Contract(BRIDGE_ABI, sideConfig.bridge)
    retry3Times(ethBridge.methods.getFeePercentage().call).then(fee => {
      data.sideFee = fee / sideConfig.feePercentageDivider
    })
    // We have the premice that the limits will be equal in Side and in RSK
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

    const sideAllowTokens = new sideWeb3.eth.Contract(ALLOW_TOKENS_ABI, sideConfig.allowTokens)
    retry3Times(sideAllowTokens.methods.getConfirmations().call).then(confirmations => {
      data.sideConfirmations = {
        smallAmount: confirmations.smallAmount,
        smallAmountTime: blocksToTime(confirmations.smallAmount, sideConfig.secondsPerBlock),
        mediumAmount: confirmations.mediumAmount,
        mediumAmountTime: blocksToTime(confirmations.mediumAmount, sideConfig.secondsPerBlock),
        largeAmount: confirmations.largeAmount,
        largeAmountTime: blocksToTime(confirmations.largeAmount, sideConfig.secondsPerBlock),
      }
    })

    const sideFederation = new sideWeb3.eth.Contract(FEDERATION_ABI, sideConfig.federation)
    retry3Times(sideFederation.methods.getMembers().call).then(
      members => (data.sideFedMembers = members),
    )
  },
}
</script>
