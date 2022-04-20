<template>
  <ImportantDetailsErc20
    :rsk-fee="settings.rskFee"
    :side-fee="settings.sideFee"
    :rsk-confirmations="settings.rskConfirmations"
    :side-confirmations="settings.sideConfirmations"
    :rsk-fed-members="settings.rskFedMembers"
    :side-fed-members="settings.sideFedMembers"
  />
</template>

<script>
import ImportantDetailsErc20 from '@/components/importantDetails/ImportantDetailsErc20'
import { store } from '@/store'

export default {
  name: 'NetworkInfoPage',
  components: { ImportantDetailsErc20 },
  data() {
    return {
      sharedState: store.state,
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
