<template>
  <div class="transaction-list mt-5 mb-5">
    <h2 class="subtitle">Account transactions</h2>
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
      <div
        id="nav-eth-rsk"
        class="tab-pane fade show active"
        role="tabpanel"
        aria-labelledby="nav-eth-rsk-tab"
      >
        <!-- Dinamic content made with JS -->
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
      </div>
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

import { TXN_Storage } from '@/utils'

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
  },
  data() {
    return {
      sharedState: store.state,
      transactions: [],
      rskBlockNumber: 0,
      ethBlockNumber: 0,
      pollingBlockNumber: null,
    }
  },
  computed: {
    accountConnected() {
      return `${this.sharedState.chainId} ${this.sharedState.accountAddress}`
    },
  },
  watch: {
    accountConnected() {
      this.refreshTransactions()
    },
    newTransaction() {
      if (!this.newTransaction) return
      this.transactions.unshift(this.newTransaction)
    },
  },
  created() {
    if (TXN_Storage.isStorageAvailable('localStorage')) {
      console.log(`Local Storage Available!`)
    } else {
      console.log(`Local Storage Unavailable!`)
    }
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
        rskWeb3.eth.getBlockNumber().then(blockNumber => {
          data.rskBlockNumber = blockNumber
        })
      }
      if (ethWeb3) {
        ethWeb3.eth.getBlockNumber().then(blockNumber => {
          data.ethBlockNumber = blockNumber
        })
      }
    },
    refreshTransactions() {
      if (!this.sharedState.accountAddress) {
        this.transactions = []
        return
      }
      // Bring transactions from version 1
      // we will remove this after some time running version 2
      let activeAddressRsk2EthTxns = TXN_Storage.getAllTxns4Address(
        this.sharedState.accountAddress,
        this.sharedState.rskConfig.localStorageName,
      )
      activeAddressRsk2EthTxns = activeAddressRsk2EthTxns.map(x => {
        x.senderAddress = x.senderAddress ? x.senderAddress : x.from
        x.receiverAddress = x.receiverAddress ? x.receiverAddress : this.sharedState.accountAddress
        return x
      })
      let activeAddressEth2RskTxns = TXN_Storage.getAllTxns4Address(
        this.sharedState.accountAddress,
        this.sharedState.ethConfig.localStorageName,
      )
      activeAddressEth2RskTxns = activeAddressEth2RskTxns.map(x => {
        x.senderAddress = x.senderAddress ? x.senderAddress : x.from
        x.receiverAddress = x.receiverAddress ? x.receiverAddress : this.sharedState.accountAddress
        return x
      })
      this.transactions = activeAddressRsk2EthTxns
        .concat(activeAddressEth2RskTxns)
        .sort(x => x.timeStamp)
    },
  },
}
</script>
