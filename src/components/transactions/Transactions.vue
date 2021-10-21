<template>
  <div class="transactions">
    <SearchTransaction
      v-if="sharedState.isConnected"
      :types-limits="typesLimits"
      :rsk-confirmations="rskConfirmations"
      :side-confirmations="sideConfirmations"
      :rsk-fed-members="rskFedMembers"
      :side-fed-members="sideFedMembers"
      :rsk-block-number="rskBlockNumber"
      :side-block-number="sideBlockNumber"
    />
    <TransactionList
      :types-limits="typesLimits"
      :rsk-confirmations="rskConfirmations"
      :side-confirmations="sideConfirmations"
      :rsk-fed-members="rskFedMembers"
      :side-fed-members="sideFedMembers"
      :transactions="transactions"
      :rsk-block-number="rskBlockNumber"
      :side-block-number="sideBlockNumber"
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
import globalStore from '@/stores/global.store'
import { TOKEN_TYPE_ERC_20 } from '@/constants/tokenType'

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
    sideConfirmations: {
      type: Object,
      required: true,
    },
    rskFedMembers: {
      type: Array,
      required: true,
    },
    sideFedMembers: {
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
      globalState: globalStore.state,
      transactions: [],
      rskBlockNumber: 0,
      sideBlockNumber: 0,
      pollingBlockNumber: null,
      limit: 10,
      totalTransactions: 0,
    }
  },
  computed: {
    accountConnected() {
      return `${this.sharedState.chainId} ${this.sharedState.accountAddress}`
    },
    tokenTypeSelected() {
      return this.globalState.currentTokenType
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
    tokenTypeSelected() {
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
      const sideWeb3 = this.sharedState.sideWeb3
      if (rskWeb3) {
        retry3Times(rskWeb3.eth.getBlockNumber).then(blockNumber => {
          data.rskBlockNumber = blockNumber
        })
      }
      if (sideWeb3) {
        retry3Times(sideWeb3.eth.getBlockNumber).then(blockNumber => {
          data.sideBlockNumber = blockNumber
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
      const accountAddress = this.sharedState.accountAddress
      const rskConfig = this.sharedState.rskConfig
      const sideConfig = this.sharedState.sideConfig
      if (!accountAddress) {
        this.transactions = []
        return
      }
      /**
       * Synchronize transactions from localstorage
       * TODO: consider removing for later versions
       */
      await this.$services.TransactionService.synchronizeTransactions(
        accountAddress,
        rskConfig.localStorageName,
      )
      await this.$services.TransactionService.synchronizeTransactions(
        accountAddress,
        sideConfig.localStorageName,
      )
      /* Synchronization end */
      const tokenTypes = [this.globalState.currentTokenType]
      if (this.globalState.currentTokenType === TOKEN_TYPE_ERC_20) {
        // To support old transactions without token type field
        tokenTypes.push(null)
        tokenTypes.push(undefined)
      }

      const {
        info: { total },
        data,
      } = await this.$services.TransactionService.getTransactions(
        accountAddress,
        [rskConfig.networkId, sideConfig.networkId],
        tokenTypes,
        {
          limit,
          offset,
        },
      )
      this.transactions = data
      this.totalTransactions = total
    },
  },
}
</script>
