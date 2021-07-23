<template>
  <div class="search-transaction mt-5 mb-5">
    <h2 id="search-crossing" class="subtitle">Search a crossing transaction</h2>
  </div>
  <Form
    id="searchForm"
    name="searchForm"
    class="search-form form-inline d-flex justify-content-center"
    @submit="onSubmit"
  >
    <div class="select-network">
      <label class="sr-only" for="transactionHash">Select Network</label>
      <div class="input-group mr-sm-2">
        <div class="form-check form-check-inline">
          <input
            id="selectedNetworkRsk"
            v-model="selectedNetwork"
            class="form-check-input"
            type="radio"
            name="selectedNetwork"
            :value="sharedState.rskConfig"
          />
          <label class="form-check-label" for="inlineRadio1">{{
            sharedState.rskConfig.name
          }}</label>
        </div>
        <div class="form-check form-check-inline">
          <input
            id="selectedNetworkEth"
            v-model="selectedNetwork"
            class="form-check-input"
            type="radio"
            name="selectedNetwork"
            :value="sharedState.ethConfig"
          />
          <label class="form-check-label" for="inlineRadio2">{{
            sharedState.ethConfig.name
          }}</label>
        </div>
      </div>
    </div>
    <div class="transaction-hash">
      <label class="sr-only" for="transactionHash">Transaction Hash</label>
      <div class="input-group mr-sm-2 flex-column">
        <Field
          id="transactionHash"
          v-model="transactionHash"
          type="text"
          name="transactionHash"
          class="form-control"
          placeholder="0x89d581d8055...3803643fd3799fb0a73"
          :rules="validateHash"
          required
        />
        <div class="invalid-feedback-container">
          <ErrorMessage class="invalid-feedback" name="transactionHash" />
        </div>
      </div>
    </div>
    <div class="input-group mr-sm-2 flex-column">
      <button v-if="!isSearching" type="submit" class="btn btn-primary mb-2">Search</button>
      <div v-else>
        <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
        <span class="sr-only">Searching...</span>
      </div>
      <div class="invalid-feedback-container"></div>
    </div>
  </Form>
  <div v-if="searchedTransaction">
    <div v-if="!transaction">
      <h5 class="subtitle">Couldn't find transaction</h5>
    </div>
    <div v-else-if="!isCrossTransaction">
      <h5 class="subtitle">This transaction doesn't have a Cross event from the Bridge</h5>
    </div>
    <div v-else>
      <table class="table mt-3">
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
  </div>
</template>

<script>
import { Field, Form, ErrorMessage } from 'vee-validate'
import BigNumber from 'bignumber.js'

import { store } from '@/store.js'
import TransactionRow from './TransactionRow.vue'
import BRIDGE_ABI from '@/constants/abis/bridge.json'

import { TXN_Storage } from '@/utils'

export default {
  name: 'TransactionList',
  components: {
    TransactionRow,
    Form,
    Field,
    ErrorMessage,
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
      selectedNetwork: store.state.rskConfig,
      transactionHash: '',
      searchedTransaction: false,
      isSearching: false,
      transaction: null,
    }
  },
  created() {
    if (TXN_Storage.isStorageAvailable('localStorage')) {
      console.log(`Local Storage Available!`)
    } else {
      console.log(`Local Storage Unavailable!`)
    }
  },
  methods: {
    validateHash(value) {
      if (!value) return 'transaction hash is required'
      if (!/^(0x)?[0-9a-f]{64}$/i.test(value)) {
        return 'invalid hash'
      }
      return true
    },
    async onSubmit() {
      const data = this
      data.isSearching = true
      const originWeb3 = data.selectedNetwork.isRsk
        ? data.sharedState.rskWeb3
        : data.sharedState.ethWeb3

      const receipt = await originWeb3.eth.getTransactionReceipt(data.transactionHash)
      if (!receipt) {
        data.searchedTransaction = true
        data.transaction = null
        data.isSearching = false
        return
      }
      const block = await originWeb3.eth.getBlock(receipt.blockNumber)
      const eventJsonInterface = BRIDGE_ABI.find(x => x.name === 'Cross' && x.type === 'event')
      if (!eventJsonInterface) {
        data.isCrossTransaction = false
        data.searchedTransaction = true
        data.transaction = null
        data.isSearching = false
        return
      } else {
        data.isCrossTransaction = true
      }
      const eventSignature = originWeb3.eth.abi.encodeEventSignature(eventJsonInterface)
      const event = receipt.logs.find(x => x.topics[0] === eventSignature)
      event.topics.shift()
      const decodedEvent = originWeb3.eth.abi.decodeLog(
        eventJsonInterface.inputs,
        event.data,
        event.topics,
      )

      const token = data.sharedState.tokens.find(x => {
        return (
          x[data.selectedNetwork.networkId].address.toLowerCase() ==
            decodedEvent._tokenAddress.toLowerCase() ||
          // When crossing back uses the original token address
          x[data.selectedNetwork.crossToNetwork.networkId].address.toLowerCase() ==
            decodedEvent._tokenAddress.toLowerCase()
        )
      })
      const tokenFromNetwork = token[data.selectedNetwork.networkId]
      const tokenToNetwork = token[data.selectedNetwork.crossToNetwork.networkId]

      const transaction = {
        type: 'Cross',
        networkId: data.selectedNetwork.networkId,
        tokenFrom: tokenFromNetwork.symbol,
        tokenTo: tokenToNetwork.symbol,
        receiveAmount: new BigNumber(decodedEvent._amount)
          .div(10 ** tokenFromNetwork.decimals)
          .toString(),
        senderAddress: decodedEvent._from,
        receiverAddress: decodedEvent._to,
        timestamp: block.timestamp,
        ...receipt,
      }

      if (data.sharedState.accountAddress?.toLowerCase() == decodedEvent._from.toLowerCase()) {
        // save transaction for sender ...
        TXN_Storage.addOrUpdateTxn(
          decodedEvent._from,
          data.selectedNetwork.localStorageName,
          transaction,
        )
      }
      if (
        decodedEvent._from.toLowerCase() != decodedEvent._to.toLowerCase() &&
        data.sharedState.accountAddress?.toLowerCase() == decodedEvent._to.toLowerCase()
      ) {
        // save transaction for receiver ...
        TXN_Storage.addOrUpdateTxn(
          decodedEvent._to,
          data.selectedNetwork.crossToNetwork.localStorageName,
          transaction,
        )
      }
      data.transaction = transaction
      data.searchedTransaction = true
      data.isSearching = false
    },
  },
}
</script>
<style scoped>
#transactionHash {
  min-width: 600px;
}
</style>
