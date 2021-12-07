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

        <ImportantDetailsErc20
          v-if="globalState.currentTokenType === tokenTypeErc20"
          :rsk-fee="rskFee"
          :side-fee="sideFee"
          :rsk-confirmations="rskConfirmations"
          :side-confirmations="sideConfirmations"
          :rsk-fed-members="rskFedMembers"
          :side-fed-members="sideFedMembers"
        />
        <ImportantDetailsErc721
          v-else
          :rsk-fee-nft="rskFeeNft"
          :side-fee-nft="sideFeeNft"
          :rsk-confirmations-nft="rskConfirmationsNft"
          :side-confirmations-nft="sideConfirmationsNft"
          :rsk-fed-members="rskFedMembers"
          :side-fed-members="sideFedMembers"
        />

        <TokenList
          v-if="
            globalState.currentTokenType === tokenTypeErc20 &&
              sharedState.rskConfig?.tokens.length > 0
          "
          :types-limits="typesLimits"
        />
      </div>
      <!--- End Tab Content -->
    </section>
  </div>
</template>

<script>
// --------- import TOKENS and network CONFIG --------------

import { TOKEN_TYPE_ERC_20 } from '@/constants/tokenType.js'

import 'popper.js'
import 'bootstrap'

import { blocksToTime } from '@/utils'

import Title from '@/components/title/Title.vue'
import Transactions from '@/components/transactions/Transactions.vue'
import ImportantDetailsErc20 from '@/components/importantDetails/ImportantDetailsErc20.vue'
import ImportantDetailsErc721 from '@/components/importantDetails/ImportantDetailsErc721.vue'
import TokenList from '@/components/tokenList/TokenList.vue'
import { store } from '@/store.js'
import globalStore from '@/stores/global.store'
import FormWrapper from '@/components/formWrapper/FormWrapper'
import HostNetwork from '@/modules/networks/HostNetwork'
import SideNetwork from '@/modules/networks/SideNetwork'
import { isEmpty } from '@/utils/helpers'

export default {
  name: 'Home',
  components: {
    FormWrapper,
    Title,
    ImportantDetailsErc20,
    ImportantDetailsErc721,
    TokenList,
    Transactions,
  },
  data() {
    return {
      sharedState: store.state,
      typesLimits: [],
      rskFee: 0,
      sideFee: 0,
      rskFeeNft: 0,
      sideFeeNft: 0,
      rskConfirmations: {},
      sideConfirmations: {},
      rskConfirmationsNft: {},
      sideConfirmationsNft: {},
      rskFedMembers: [],
      sideFedMembers: [],
      newTransaction: null,
      globalState: globalStore.state,
      tokenTypeErc20: TOKEN_TYPE_ERC_20,
      needPreSettings: false,
      networks: [],
    }
  },
  computed: {
    isConnected() {
      return this.sharedState.isConnected && !this.sharedState.preSettingsEnabled
    },
    isLoadedAllInfo() {
      return [
        this.typesLimits,
        this.rskFedMembers,
        this.sideFedMembers,
        this.rskConfirmations,
        this.sideConfirmations,
      ].every(entry => !isEmpty(entry))
    },
  },
  created() {
    this.$watch(
      () => this.sharedState.chainId,
      (chainId, prevChainId) => {
        if (chainId && this.sharedState.isConnected && !this.sharedState.preSettingsEnabled) {
          this.initMainSettings()
        }
      },
    )
    this.$watch(
      () => this.sharedState.preSettingsEnabled,
      (preSettingsEnabled, preSettingsEnabledPrev) => {
        if (preSettingsEnabled) {
          this.needPreSettings = preSettingsEnabled
          this.networks = this.sharedState.networksAvailable
        }
      },
    )
  },
  methods: {
    async initMainSettings() {
      const data = this
      const rskWeb3 = this.sharedState.rskWeb3
      const rskConfig = this.sharedState.rskConfig
      const sideWeb3 = this.sharedState.sideWeb3
      const sideConfig = this.sharedState.sideConfig

      const sideNetwork = new SideNetwork(sideConfig, sideWeb3)
      const hostNetwork = new HostNetwork(rskConfig, rskWeb3)

      data.rskFee = await hostNetwork.getFeePercentage()

      data.sideFee = await sideNetwork.getFeePercentage()
      // We have the premice that the limits will be equal in Side and in RSK
      // And the tokens wil have the same type on both networks
      const { limits, confirmations } = await hostNetwork.allowTokensActions()
      data.typesLimits = limits
      data.rskConfirmations = confirmations
      data.rskFedMembers = await hostNetwork.getMembers()

      const { confirmations: sideConfirmations } = await sideNetwork.allowTokensActions()
      data.sideConfirmations = sideConfirmations

      data.sideFedMembers = await sideNetwork.getMembers()

      // NFT
      if (!rskConfig.nftBridge || !sideConfig.nftBridge) {
        return
      }
      data.rskFeeNft = await hostNetwork.getFixedFee()

      data.sideFeeNft = await sideNetwork.getFixedFee()

      const NFT_FIXED_CONFIRMATIONS_BLOCK = 3 // maybe we are going to define it into the nft bridge contract

      data.rskConfirmationsNft = {
        confirmations: NFT_FIXED_CONFIRMATIONS_BLOCK,
        time: blocksToTime(NFT_FIXED_CONFIRMATIONS_BLOCK, rskConfig.secondsPerBlock),
      }
      data.sideConfirmationsNft = {
        confirmations: NFT_FIXED_CONFIRMATIONS_BLOCK,
        time: blocksToTime(NFT_FIXED_CONFIRMATIONS_BLOCK, sideConfig.secondsPerBlock),
      }
    },
  },
}
</script>
