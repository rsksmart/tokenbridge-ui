<template>
  <ImportantDetailsErc20
    v-if="globalState.currentTokenType === tokenTypeErc20"
    :rsk-fee="settings.rskFee"
    :side-fee="settings.sideFee"
    :rsk-confirmations="settings.rskConfirmations"
    :side-confirmations="settings.sideConfirmations"
    :rsk-fed-members="settings.rskFedMembers"
    :side-fed-members="settings.sideFedMembers"
  />
  <ImportantDetailsErc721
    v-else
    :rsk-fee-nft="settings.rskFeeNft"
    :side-fee-nft="settings.sideFeeNft"
    :rsk-confirmations-nft="settings.rskConfirmationsNft"
    :side-confirmations-nft="settings.sideConfirmationsNft"
    :rsk-fed-members="settings.rskFedMembers"
    :side-fed-members="settings.sideFedMembers"
  />
</template>

<script>
import ImportantDetailsErc20 from '@/components/importantDetails/ImportantDetailsErc20'
import ImportantDetailsErc721 from '@/components/importantDetails/ImportantDetailsErc721'
import { store } from '@/store'
import { TOKEN_TYPE_ERC_20 } from '@/constants/tokenType'
import globalStore from '@/stores/global.store'

export default {
  name: 'NetworkInfoPage',
  components: { ImportantDetailsErc721, ImportantDetailsErc20 },
  data() {
    return {
      sharedState: store.state,
      globalState: globalStore.state,
      tokenTypeErc20: TOKEN_TYPE_ERC_20,
    }
  },
  computed: {
    settings() {
      return this.sharedState.networkSettings
    },
  },
}
</script>

<style scoped></style>
