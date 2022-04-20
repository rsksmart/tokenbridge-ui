<template>
  <section class="container main-div">
    <Title />
    <cross-form
      :types-limits="settings.typesLimits"
      :rsk-fee="settings.rskFee"
      :side-fee="settings.sideFee"
      :rsk-confirmations="settings.rskConfirmations"
      :side-confirmations="settings.sideConfirmations"
      @new-transaction="newTransaction = $event"
    ></cross-form>
  </section>
</template>

<script>
// --------- import TOKENS and network CONFIG --------------

import 'popper.js'
import 'bootstrap'

import Title from '@/components/title/Title.vue'
import { store } from '@/store.js'
import CrossForm from '@/components/crossForm/CrossForm.vue'

export default {
  name: 'Home',
  components: {
    CrossForm,
    Title,
  },
  data() {
    return {
      sharedState: store.state,
      newTransaction: null,
    }
  },
  computed: {
    isConnected() {
      return this.sharedState.isConnected && !this.sharedState.preSettingsEnabled
    },
    settings() {
      return this.sharedState.networkSettings
    },
  },
}
</script>
