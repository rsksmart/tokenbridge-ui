<template>
  <div class="transaction-list mb-5">
    <h2 id="account-transactions" class="subtitle">Account transactions</h2>
    <p class="text-center">
      Please note that all transactions listed here will not appear if you use another device
    </p>

    <div v-if="!sharedState.isConnected">
      <h5 class="subtitle">No active account, please connect your wallet</h5>
    </div>
    <div v-else-if="transactions.length === 0">
      <h5 class="subtitle">No transactions found for the active account</h5>
    </div>
    <div v-else>
      <table class="table">
        <caption>
          <div class="d-flex justify-content-between align-items-center">
            <span>
              Page {{ currentPage }} of {{ totalPages }} | Showing {{ recordsOnPage }} of
              {{ totalTransactions }} records
            </span>
            <select
              v-model="limitSelect"
              class="form-select px-4 py-2 border rounded-2 bg-light fw-bold"
              aria-label="Number of records on page"
              @change="changeLimit($event)"
            >
              <option :value="5" selected>5</option>
              <option :value="10">10</option>
              <option :value="20">20</option>
              <option :value="30">30</option>
            </select>
          </div>
        </caption>
        <component
          :is="currentTableType"
          :types-limits="typesLimits"
          :rsk-confirmations="rskConfirmations"
          :side-confirmations="sideConfirmations"
          :rsk-fed-members="rskFedMembers"
          :side-fed-members="sideFedMembers"
          :transactions="transactions"
          :rsk-block-number="rskBlockNumber"
          :side-block-number="sideBlockNumber"
        />
      </table>
      <div class="btn-toolbar" role="toolbar" aria-label="Toolbar with button groups">
        <div class="btn-group mr-2 btn-group-sm" role="group" aria-label="First group">
          <button
            id="txn-previous"
            type="button"
            class="btn btn-outline-primary"
            :disabled="currentPage === 1"
            @click="previousPage"
          >
            &lt; previous
          </button>
          <button
            id="txn-next"
            type="button"
            class="btn btn-outline-primary"
            :disabled="currentPage === totalPages"
            @click="nextPage"
          >
            next >
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { store } from '@/store.js'
import globalStore from '@/stores/global.store'
import ERC20TransactionTable from '@/components/transactions/transactionsTables/ERC20Table/ERC20TransactionTable'
import ERC721TransactionTable from '@/components/transactions/transactionsTables/ERC721Table/ERC721TransactionTable'
import { TOKEN_TYPE_ERC_20, TOKEN_TYPE_ERC_721 } from '@/constants/tokenType'

export default {
  name: 'TransactionList',
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
    transactions: {
      type: Array,
      required: true,
    },
    rskBlockNumber: {
      type: Number,
      required: true,
    },
    sideBlockNumber: {
      type: Number,
      required: true,
    },
    limit: {
      type: Number,
      default: 5,
    },
    totalTransactions: {
      type: Number,
      default: 0,
    },
  },
  emits: ['changePagination', 'changeLimit'],
  data() {
    return {
      sharedState: store.state,
      globalState: globalStore.state,
      offset: 0,
      limitSelect: 5,
    }
  },
  computed: {
    totalPages() {
      return Math.ceil(this.totalTransactions / this.limit)
    },
    currentPage() {
      return Math.round(this.offset / this.limit) + 1
    },
    recordsOnPage() {
      return this.transactions.length
    },
    currentTableType() {
      switch (this.globalState.currentTokenType) {
        case TOKEN_TYPE_ERC_20:
          return ERC20TransactionTable
        case TOKEN_TYPE_ERC_721:
          return ERC721TransactionTable
        default:
          throw new Error(`Transaction type ${this.globalState.currentTokenType} is not supported`)
      }
    },
  },
  methods: {
    changeLimit(event) {
      this.$emit('changeLimit', parseInt(event.target.value, 5))
    },
    nextPage() {
      this.offset += this.limit
      if (this.offset > this.totalTransactions) {
        this.offset -= this.limit
      }
      this.$emit('changePagination', { limit: this.limit, offset: this.offset })
    },
    previousPage() {
      this.offset -= this.limit
      if (this.offset <= 0) {
        this.offset = 0
      }
      this.$emit('changePagination', { limit: this.limit, offset: this.offset })
    },
  },
}
</script>
