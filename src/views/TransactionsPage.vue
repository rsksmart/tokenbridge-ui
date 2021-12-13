<template>
  <Transactions
    :types-limits="settings.typesLimits"
    :rsk-confirmations="settings.rskConfirmations"
    :side-confirmations="settings.sideConfirmations"
    :rsk-fed-members="settings.rskFedMembers"
    :side-fed-members="settings.sideFedMembers"
    :new-transaction="newTransaction"
  />
</template>

<script>
import Transactions from '@/components/transactions/Transactions'
import { store } from '@/store'

export default {
  name: 'TransactionsPage',
  components: {
    Transactions,
  },
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
