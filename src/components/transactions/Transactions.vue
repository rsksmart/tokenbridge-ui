<template>
  <div class="transactions">
    <SearchTransaction
      :types-limits="typesLimits"
      :rsk-confirmations="rskConfirmations"
      :eth-confirmations="ethConfirmations"
      :rsk-fed-members="rskFedMembers"
      :eth-fed-members="ethFedMembers"
      :rsk-block-number="rskBlockNumber"
      :eth-block-number="ethBlockNumber"
    />
    <TransactionList
      :types-limits="typesLimits"
      :rsk-confirmations="rskConfirmations"
      :eth-confirmations="ethConfirmations"
      :rsk-fed-members="rskFedMembers"
      :eth-fed-members="ethFedMembers"
      :new-transaction="newTransaction"
      :transactions="transactions"
      :rsk-block-number="rskBlockNumber"
      :eth-block-number="ethBlockNumber"
      :limit="limit"
      :total-transactions="totalTransactions"
      @changePagination="changePagination"
      @changeLimit="changeLimit"
    />
  </div>
</template>

<script>
import { store } from '@/store.js'
import TransactionList from './TransactionList.vue'
import SearchTransaction from './SearchTransaction.vue'

import { retry3Times } from '@/utils'

export default {
  name: 'Transactions',
  components: {
    SearchTransaction,
    TransactionList,
  },
  inject: ['$services'],
  props: {
    typesLimits: {
      type: Array,
      required: true,
    },
    rskConfirmations: {
      type: Object,
      required: true,
    },
    ethConfirmations: {
      type: Object,
      required: true,
    },
    rskFedMembers: {
      type: Array,
      required: true,
    },
    ethFedMembers: {
      type: Array,
      required: true,
    },
    newTransaction: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      sharedState: store.state,
      transactions: [],
      rskBlockNumber: 0,
      ethBlockNumber: 0,
      pollingBlockNumber: null,
      limit: 10,
      totalTransactions: 0,
    }
  },
  computed: {
    accountConnected() {
      return `${this.sharedState.chainId} ${this.sharedState.accountAddress}`
    },
  },
  watch: {
    accountConnected() {
      this.refreshTransactions({ limit: this.limit, offset: 0 })
    },
    newTransaction() {
      if (!this.newTransaction) return
      this.refreshTransactions({ limit: this.limit, offset: 0 })
    },
  },
  created() {
    this.refreshBlockNumber()

    this.pollingBlockNumber = setInterval(
      function() {
        this.refreshBlockNumber()
      }.bind(this),
      20_000,
    )
  },
  beforeUnmount() {
    clearInterval(this.pollingBlockNumber)
  },
  methods: {
    refreshBlockNumber() {
      const data = this
      const rskWeb3 = this.sharedState.rskWeb3
      const ethWeb3 = this.sharedState.ethWeb3
      if (rskWeb3) {
        retry3Times(rskWeb3.eth.getBlockNumber).then(blockNumber => {
          data.rskBlockNumber = blockNumber
        })
      }
      if (ethWeb3) {
        retry3Times(ethWeb3.eth.getBlockNumber).then(blockNumber => {
          data.ethBlockNumber = blockNumber
        })
      }
    },
    changePagination({ limit, offset }) {
      this.refreshTransactions({ limit, offset })
    },
    changeLimit(selectedLimit) {
      this.limit = selectedLimit
      this.refreshTransactions({ limit: selectedLimit, offset: 0 })
    },
    async refreshTransactions({ limit, offset }) {
      if (!this.sharedState.accountAddress) {
        this.transactions = []
        return
      }
      /**
       * Synchronize transactions from localstorage
       * TODO: consider removing for later versions
       */
      await this.$services.TransactionService.synchronizeTransactions(
        this.sharedState.accountAddress,
        this.sharedState.rskConfig.localStorageName,
      )
      await this.$services.TransactionService.synchronizeTransactions(
        this.sharedState.accountAddress,
        this.sharedState.ethConfig.localStorageName,
      )
      /* Synchronization end */

      const {
        info: { total },
        data,
      } = await this.$services.TransactionService.getTransactions(this.sharedState.accountAddress, {
        limit,
        offset,
      })
      this.transactions = data
      this.totalTransactions = total
    },
  },
}
</script>
