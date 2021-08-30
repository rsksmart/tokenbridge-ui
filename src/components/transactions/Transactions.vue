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
    />
  </div>
</template>

<script>
import { store } from '@/store.js'
import TransactionList from './TransactionList.vue'
import SearchTransaction from './SearchTransaction.vue'

import { TXN_Storage, retry3Times } from '@/utils'

export default {
  name: 'Transactions',
  components: {
    SearchTransaction,
    TransactionList,
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
      const allTransactions = activeAddressRsk2EthTxns.concat(activeAddressEth2RskTxns)
      this.transactions = allTransactions.sort(x => x.timestamp).reverse() // sort decsending
    },
  },
}
</script>
