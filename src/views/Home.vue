<template>
  <section id="home" class="container">
    <Title />
    <FormWrapper
      :types-limits="settings.typesLimits"
      :rsk-fee="settings.rskFee"
      :side-fee="settings.sideFee"
      :rsk-confirmations="settings.rskConfirmations"
      :side-confirmations="settings.sideConfirmations"
      @new-transaction="newTransaction = $event"
    />
  </section>
</template>

<script>
// --------- import TOKENS and network CONFIG --------------

import 'popper.js'
import 'bootstrap'

import Title from '@/components/title/Title.vue'
import { store } from '@/store.js'
import globalStore from '@/stores/global.store'
import FormWrapper from '@/components/formWrapper/FormWrapper'
export default {
  name: 'Home',
  components: {
    FormWrapper,
    Title,
  },
  data() {
    return {
      sharedState: store.state,
      newTransaction: null,
      globalState: globalStore.state,
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
  // created() {
  //   this.$watch(
  //     () => this.sharedState.chainId,
  //     (chainId, prevChainId) => {
  //       if (chainId && this.sharedState.isConnected && !this.sharedState.preSettingsEnabled) {
  //         this.initMainSettings()
  //       }
  //     },
  //   )
  //   this.$watch(
  //     () => this.sharedState.preSettingsEnabled,
  //     (preSettingsEnabled, preSettingsEnabledPrev) => {
  //       if (preSettingsEnabled) {
  //         this.needPreSettings = preSettingsEnabled
  //         this.networks = this.sharedState.networksAvailable
  //       }
  //     },
  //   )
  // },
}
</script>
