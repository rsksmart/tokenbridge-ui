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
            sharedState.rskConfig?.name
          }}</label>
        </div>
        <div class="form-check form-check-inline">
          <input
            id="selectedNetworkSide"
            v-model="selectedNetwork"
            class="form-check-input"
            type="radio"
            name="selectedNetwork"
            :value="sharedState.sideConfig"
          />
          <label class="form-check-label" for="inlineRadio2">{{
            sharedState.sideConfig?.name
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
        <component
          :is="currentTableType"
          :types-limits="typesLimits"
          :rsk-confirmations="rskConfirmations"
          :side-confirmations="sideConfirmations"
          :rsk-fed-members="rskFedMembers"
          :side-fed-members="sideFedMembers"
          :transactions="[transaction]"
          :rsk-block-number="rskBlockNumber"
          :side-block-number="sideBlockNumber"
        />
      </table>
    </div>
  </div>
</template>

<script>
import { Field, Form, ErrorMessage } from 'vee-validate'
import BigNumber from 'bignumber.js'

import { store } from '@/store.js'
import { decodeCrossEvent } from '@/utils/decodeEvents'
import { TOKEN_TYPE_ERC_20, TOKEN_TYPE_ERC_721 } from '@/constants/tokenType'
import ERC20TransactionTable from '@/components/transactions/transactionsTables/ERC20Table/ERC20TransactionTable'
import ERC721TransactionTable from '@/components/transactions/transactionsTables/ERC721Table/ERC721TransactionTable'
import globalStore from '@/stores/global.store'
import ERC20TokenTransaction from '@/modules/transactions/transactionsTypes/ERC20TokenTransaction'
import ERC721NFTTransaction from '@/modules/transactions/transactionsTypes/ERC721NFTTransaction'

export default {
  name: 'TransactionList',
  components: {
    Form,
    Field,
    ErrorMessage,
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
    rskBlockNumber: {
      type: Number,
      required: true,
    },
    sideBlockNumber: {
      type: Number,
      required: true,
    },
  },
  emits: ['onSearchTransaction'],
  data() {
    return {
      sharedState: store.state,
      globalState: globalStore.state,
      selectedNetwork: store.state.rskConfig,
      transactionHash: '',
      searchedTransaction: false,
      isSearching: false,
      transaction: null,
      isCrossTransaction: false,
    }
  },
  computed: {
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
        : data.sharedState.sideWeb3

      const receipt = await originWeb3.eth.getTransactionReceipt(data.transactionHash)
      if (!receipt) {
        data.searchedTransaction = true
        data.transaction = null
        data.isSearching = false
        return
      }
      const result = decodeCrossEvent(originWeb3, receipt, this.globalState.currentTokenType)
      if (!result) {
        data.isCrossTransaction = false
        data.searchedTransaction = true
        data.transaction = receipt
        data.isSearching = false
        return
      } else {
        data.isCrossTransaction = true
      }
      const decodedEvent = result.decodedEvent
      // decodedEvent._from did not existed on events of previous versions
      decodedEvent._from = decodedEvent._from ?? decodedEvent._to
      let transaction = null
      const block = await originWeb3.eth.getBlock(receipt.blockNumber)
      if (this.globalState.currentTokenType === TOKEN_TYPE_ERC_20) {
        const token = data.selectedNetwork.tokens.find(token => {
          return (
            token.address.toLowerCase() === decodedEvent._tokenAddress.toLowerCase() ||
            // When crossing back uses the original token address
            token.receiveToken.address.toLowerCase() === decodedEvent._tokenAddress.toLowerCase()
          )
        })

        const receiveAmount = new BigNumber(decodedEvent._amount)
          .div(10 ** token.decimals)
          .toString()
        const erc20TokenInstance = new ERC20TokenTransaction({
          web3: originWeb3,
          config: data.selectedNetwork,
        })
        transaction = await erc20TokenInstance.saveTransaction(
          receipt,
          token,
          decodedEvent._amount,
          receiveAmount,
          decodedEvent._from,
          decodedEvent._to,
          block.timestamp * 1000,
        )
      } else if (this.globalState.currentTokenType === TOKEN_TYPE_ERC_721) {
        const erc721TokenInstance = new ERC721NFTTransaction({
          web3: originWeb3,
          config: data.selectedNetwork,
        })
        transaction = await erc721TokenInstance.saveTransaction(
          receipt,
          decodedEvent._tokenId,
          decodedEvent._originalTokenAddress,
          decodedEvent._to,
          block.timestamp * 1000,
        )
      }
      console.log('%cTransaction: ', 'color: white; background-color: purple; font-weight: bold')
      console.table(transaction)

      // await this.$services.TransactionService.saveTransaction(newTransaction)
      data.transaction = transaction
      data.searchedTransaction = true
      data.isSearching = false
      this.$emit('onSearchTransaction', transaction)
    },
  },
}
</script>
<style scoped>
#transactionHash {
  min-width: 600px;
}
</style>
