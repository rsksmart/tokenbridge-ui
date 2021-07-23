<template>
  <div class="transaction-list mt-5 mb-5">
    <h2 id="account-transactions" class="subtitle">Account transactions</h2>
    <p class="text-center">
      Please note that all transactions listed here will not appear if you use another device
    </p>

    <div v-if="!sharedState.isConnected">
      <h5 class="subtitle">No active account, please connect your wallet</h5>
    </div>
    <div v-else-if="transactions.length == 0">
      <h5 class="subtitle">No transactions found for the active account</h5>
    </div>
    <div v-else>
      <table class="table">
        <thead>
          <tr>
            <th scope="col">Action</th>
            <th scope="col">From</th>
            <th scope="col">Sender</th>
            <th scope="col">Txn hash</th>
            <th scope="col">Block number</th>
            <th scope="col">Amount</th>
            <th scope="col">To</th>
            <th scope="col">Receiver</th>
            <th scope="col">Status | Estimated time</th>
          </tr>
        </thead>
        <tbody id="eth-rsk-tbody">
          <TransactionRow
            v-for="transaction in transactions"
            :key="transaction.transactionHash"
            :transaction="transaction"
            :types-limits="typesLimits"
            :rsk-confirmations="rskConfirmations"
            :eth-confirmations="ethConfirmations"
            :rsk-block-number="rskBlockNumber"
            :eth-block-number="ethBlockNumber"
            :fed-members-len="fedMembersLen"
          />
        </tbody>
      </table>
      <div class="btn-toolbar" role="toolbar" aria-label="Toolbar with button groups">
        <div class="btn-group mr-2" role="group" aria-label="First group">
          <button id="txn-previous" type="button" class="btn btn-secondary">
            &lt; previous
          </button>
          <button id="txn-next" type="button" class="btn btn-secondary">next ></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { store } from '@/store.js'
import TransactionRow from './TransactionRow.vue'

export default {
  name: 'TransactionList',
  components: {
    TransactionRow,
  },
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
    fedMembersLen: {
      type: Number,
      required: true,
    },
    newTransaction: {
      type: Object,
      default: null,
    },
    transactions: {
      type: Array,
      required: true,
    },
    rskBlockNumber: {
      type: Number,
      required: true,
    },
    ethBlockNumber: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      sharedState: store.state,
    }
  },
}
</script>
