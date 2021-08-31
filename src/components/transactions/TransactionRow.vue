<template>
  <tr class="transaction-row">
    <th scope="row">Cross</th>
    <td :class="{ bold: isSenderNetwork }">{{ fromNetwork.name }}</td>
    <td>
      <a :href="senderAddressExplorerUrl" :class="{ bold: isSenderAddress }" target="_blank">
        {{ formattedSenderAddress }}
      </a>
    </td>
    <td>
      <a :href="transactionHashExplorerUrl" target="_blank">
        {{ formattedTransactionHash }}
      </a>
      <a href="#" class="ml-2" @click="copyTransactionHash">
        <i :class="copyIcon"></i>
      </a>
    </td>
    <td>{{ transaction.blockNumber }}</td>
    <td>{{ amountAndSymbol }}</td>
    <td :class="{ bold: isReceiverNetwork }">{{ toNetwork.name }}</td>
    <td>
      <a :href="receiverAddressExplorerUrl" :class="{ bold: isReceiverAddress }" target="_blank">
        {{ formattedReceiverAddress }}
      </a>
    </td>
    <td>
      <div v-if="currentStep === steps.Pending">
        <span class="pending">
          Pending {{ currentConfirmations }}/{{ neededConfirmations }} blocks
          <br />
          ~ {{ estimatedTime }}
        </span>
      </div>
      <div v-else-if="currentStep === steps.Voting">
        <span class="pending">
          Voting ~ {{ estimatedTime }}
          <VotingInfo :fed-members="fedMembers" :transaction="transaction" />
        </span>
      </div>
      <div v-else-if="currentStep === steps.ToClaim">
        <div v-if="!loading" class="to-claim">
          <button class="btn btn-primary claim" @click="claimClick">Claim</button>
        </div>
        <div v-else>
          <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
          <span class="sr-only">Loading...</span>
        </div>
      </div>
      <div v-else-if="currentStep === steps.Claimed">
        <span class="confirmed claimed">Claimed</span>
      </div>
    </td>
    <Modal v-if="showResultModal" @close="showResultModal = false">
      <template #title>
        {{ error ? 'Error' : 'Claimed' }}
      </template>
      <template #body>
        <p v-if="error">There was an error: {{ error }}</p>
        <h2 v-else>Operation succesful!</h2>
        <a v-if="claimTxHash" target="_blank" :href="txExplorerLink">See the transaction</a>
      </template>
    </Modal>
    <Modal v-if="showConnectionProblemModal" @close="showConnectionProblemModal = false">
      <template #title>
        Connection problem
      </template>
      <template #body>
        <p>{{ connectionProblem }}</p>
      </template>
    </Modal>
    <Modal v-if="showMismatchAddressModal" @close="showMismatchAddressModal = false">
      <template #title>
        Receiver address is not the current account
      </template>
      <template #body>
        <p>
          The receiver address {{ transaction.receiverAddress }} is not your currently connected
          account {{ sharedState.accountAddress }}
        </p>
        <p class="font-weight-bold">
          Are you sure you want to claim the funds to {{ transaction.receiverAddress }} anyway?
        </p>
      </template>
      <template #footer>
        <button class="btn btn-primary modal-default-button" @click="claim()">
          Yes
        </button>
        <button
          class="btn btn-danger modal-default-button"
          @click="showMismatchAddressModal = false"
        >
          No
        </button>
      </template>
    </Modal>
  </tr>
</template>

<script>
import BigNumber from 'bignumber.js'
import Modal from '@/components/commons/Modal.vue'
import { store } from '@/store.js'
import { wrappedFormat, blocksToTime, sanitizeTxHash, retry3Times, NULL_HASH } from '@/utils'
// import FEDERATION_ABI from '@/constants/abis/federation.json'
import BRIDGE_ABI from '@/constants/abis/bridge.json'
import { CROSSING_STEPS } from '@/constants/enums.js'
import VotingInfo from './VotingInfo.vue'
import { claim } from '@/modules/transactions/transactions.actions'
import { ESTIMATED_GAS_AVG } from '@/constants/transactions'
const DEFAULT_COPY_ICON = 'far fa-clipboard'

export default {
  name: 'TransactionRow',
  components: {
    Modal,
    VotingInfo,
  },
  inject: ['$services'],
  props: {
    transaction: {
      type: Object,
      required: true,
    },
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
    rskBlockNumber: {
      type: Number,
      required: true,
    },
    ethBlockNumber: {
      type: Number,
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
  },
  data() {
    return {
      sharedState: store.state,
      currentStep: this.transaction.currentStep || 0,
      steps: CROSSING_STEPS,
      currentConfirmations: 0,
      estimatedTime: '',
      votesCount: 0,
      txDataHash: NULL_HASH,
      claimTxHash: '',
      loading: false,
      showResultModal: false,
      error: '',
      showConnectionProblemModal: false,
      connectionProblem: '',
      showMismatchAddressModal: false,
      copyIcon: DEFAULT_COPY_ICON,
    }
  },
  computed: {
    fromNetwork() {
      return this.transaction.networkId === this.sharedState.rskConfig.networkId
        ? this.sharedState.rskConfig
        : this.sharedState.ethConfig
    },
    toNetwork() {
      return this.fromNetwork.crossToNetwork
    },
    web3() {
      return this.toNetwork.isRsk ? this.sharedState.rskWeb3 : this.sharedState.ethWeb3
    },
    transactionHashExplorerUrl() {
      if (!this.transaction.transactionHash) return ''
      return `${this.fromNetwork.explorer}/tx/${this.transaction.transactionHash}`
    },
    isSenderNetwork() {
      return this.fromNetwork.networkId === this.sharedState.currentConfig?.networkId
    },
    isReceiverNetwork() {
      return this.toNetwork.networkId === this.sharedState.currentConfig?.networkId
    },
    isSenderAddress() {
      return (
        this.transaction.senderAddress?.toLowerCase() ===
          this.sharedState.accountAddress?.toLowerCase() && this.isSenderNetwork
      )
    },
    isReceiverAddress() {
      return (
        this.transaction.receiverAddress?.toLowerCase() ===
          this.sharedState.accountAddress?.toLowerCase() && this.isReceiverNetwork
      )
    },
    senderAddressExplorerUrl() {
      if (!this.transaction.senderAddress) return ''
      return `${this.fromNetwork.explorer}/address/${this.transaction.senderAddress}${this.fromNetwork.explorerTokenTab}`
    },
    receiverAddressExplorerUrl() {
      if (!this.transaction.receiverAddress) return ''
      return `${this.fromNetwork.crossToNetwork.explorer}/address/${this.transaction.receiverAddress}${this.fromNetwork.crossToNetwork.explorerTokenTab}`
    },
    formattedTransactionHash() {
      return wrappedFormat(this.transaction.transactionHash)
    },
    formattedSenderAddress() {
      return wrappedFormat(this.transaction.senderAddress)
    },
    formattedReceiverAddress() {
      return wrappedFormat(this.transaction.receiverAddress)
    },
    latestBlock() {
      return this.fromNetwork.isRsk ? this.rskBlockNumber : this.ethBlockNumber
    },
    fedMembers() {
      return this.fromNetwork.isRsk ? this.rskFedMembers : this.ethFedMembers
    },
    token() {
      return this.sharedState.tokens.find(
        x => x[this.transaction.networkId]?.symbol === this.transaction.tokenFrom,
      )
    },
    neededConfirmations() {
      if (!this.token) {
        return false
      }
      const limits = this.typesLimits[this.token.typeId]
      const confirmations = this.fromNetwork.isRsk ? this.rskConfirmations : this.ethConfirmations
      let amount = this.transaction.amount
      if (!amount) {
        // add fees to receiveAmount to get the original amount
        // TODO use props fee instead of harcoded 0.2%
        amount = this.transaction.receiveAmount / (1 - 0.002)
      }
      return amount < new BigNumber(limits.mediumAmount).shiftedBy(-18).toNumber()
        ? confirmations.smallAmount
        : amount < new BigNumber(limits.largeAmount).shiftedBy(-18)
        ? confirmations.mediumAmount
        : confirmations.largeAmount
    },
    txExplorerLink() {
      const sanitizedTxHash = sanitizeTxHash(this.claimTxHash)
      return `${this.sharedState.currentConfig.explorer}/tx/${sanitizedTxHash}`
    },
    amountAndSymbol() {
      return this.transaction.receiveAmount
        ? `${this.transaction.receiveAmount} ${this.transaction.tokenTo}`
        : `${this.transaction.amount} ${this.transaction.tokenFrom}`
    },
  },
  watch: {
    rskBlockNumber() {
      if (!this.fromNetwork.isRsk) return
      this.refreshStep()
    },
    ethBlockNumber() {
      if (!this.fromNetwork.isEth) return
      this.refreshStep()
    },
    transaction() {
      this.currentStep = this.transaction.currentStep || 0
      this.txDataHash = NULL_HASH
      this.loading = false
      this.error = ''
      this.refreshStep()
    },
  },
  created() {
    this.refreshStep()
  },
  methods: {
    async copyTransactionHash(event) {
      event.preventDefault()
      await navigator.clipboard.writeText(this.transaction.transactionHash)
      this.copyIcon = 'fas fa-clipboard-check'
      setTimeout(() => {
        this.copyIcon = DEFAULT_COPY_ICON
      }, 1000)
    },
    txExplorerLinkTag(txHash) {
      const sanitizedTxHash = sanitizeTxHash(txHash)
      return txHash
        ? `<a target="_blank" href="${this.sharedState.currentConfig.explorer}/tx/${sanitizedTxHash}">see Tx</a>`
        : ''
    },
    async refreshStep() {
      const data = this
      if (data.currentStep >= data.steps.ToClaim) return
      if (data.currentStep === data.steps.Pending) {
        const currentConfirmations = data.latestBlock - data.transaction.blockNumber
        const blockDiff = data.neededConfirmations - currentConfirmations
        if (blockDiff > 0) {
          data.currentStep = data.steps.Pending
          data.currentConfirmations = currentConfirmations
          data.estimatedTime = blocksToTime(blockDiff, this.fromNetwork.secondsPerBlock)
        } else {
          data.currentConfirmations = data.neededConfirmations
          data.currentStep = data.steps.Voting
          data.estimatedTime = '2 minutes'
          data.votesCount = 0
        }
      }
      const bridgeContract = new data.web3.eth.Contract(BRIDGE_ABI, data.toNetwork.bridge)
      if (data.transaction.blockNumber < data.fromNetwork.v2UpdateBlock) {
        // V1 Protocol
        data.currentStep = data.steps.Claimed
        data.estimatedTime = ''
        return
      } else if (data.currentStep === data.steps.Voting && data.txDataHash === NULL_HASH) {
        // V2 Protocol
        data.txDataHash = await retry3Times(
          bridgeContract.methods.transactionsDataHashes(data.transaction.transactionHash).call,
        )
        if (data.txDataHash !== NULL_HASH) {
          data.estimatedTime = ''
          const claimed = await retry3Times(bridgeContract.methods.claimed(data.txDataHash).call)
          if (claimed) {
            data.currentStep = data.steps.Claimed
            await this.$services.TransactionService.saveTransaction({
              accountAddress: data.sharedState.accountAddress,
              currentStep: data.currentStep,
              ...data.transaction,
            })
          } else {
            data.currentStep = data.steps.ToClaim
          }
        }
      }
      if (data.currentStep !== data.transaction.currentStep) {
        await this.$services.TransactionService.saveTransaction({
          ...data.transaction,
          currentStep: data.currentStep,
        })
      }
    },
    async claim() {
      const data = this
      const sharedState = data.sharedState
      data.showMismatchAddressModal = false
      data.loading = true
      const originWeb3 = data.fromNetwork.isRsk ? sharedState.rskWeb3 : sharedState.ethWeb3
      // Always retrieve transaction block hash as data.transaction.blockHash
      // may not be the final block hash in RSK
      const receipt = await originWeb3.eth.getTransactionReceipt(data.transaction.transactionHash)
      const eventJsonInterface = BRIDGE_ABI.find(x => x.name === 'Cross' && x.type === 'event')
      const eventSignature = originWeb3.eth.abi.encodeEventSignature(eventJsonInterface)
      const event = receipt.logs.find(x => x.topics[0] === eventSignature)
      event.topics.shift()
      const decodedEvent = originWeb3.eth.abi.decodeLog(
        eventJsonInterface.inputs,
        event.data,
        event.topics,
      )
      const gasPrice = await store.getGasPriceHex()

      try {
        const receiptResponse = await claim(
          { config: data.toNetwork, web3: sharedState.web3 },
          {
            to: decodedEvent._to,
            amount: decodedEvent._amount,
            blockHash: event.blockHash,
            transactionHash: event.transactionHash,
            logIndex: event.logIndex,
            txExplorerLink: data.txExplorerLinkTag,
          },
          { from: sharedState.accountAddress, gasPrice: gasPrice, gas: ESTIMATED_GAS_AVG },
        )
        if (receiptResponse) {
          data.currentStep = data.steps.Claimed
          data.loading = false
          data.error = ''
          data.showResultModal = true
          await this.$services.TransactionService.saveTransaction({
            ...data.transaction,
            currentStep: data.currentStep,
          })
        }
      } catch (error) {
        data.loading = false
        data.error = error.message
        data.showResultModal = true
        console.error(error)
      }
    },
    async claimClick() {
      const data = this
      const sharedState = data.sharedState
      if (!sharedState.isConnected) {
        data.connectionProblem = `Wallet not connected. You need to connect your wallet to ${data.toNetwork.name}`
        data.showConnectionProblemModal = true
        return
      }
      if (sharedState.currentConfig.networkId !== this.toNetwork.networkId) {
        data.connectionProblem = `Wrong network. To claim this tokens you need to connect your wallet to ${data.toNetwork.name}`
        data.showConnectionProblemModal = true
        return
      }
      if (
        sharedState.accountAddress.toLowerCase() === data.transaction.receiverAddress.toLowerCase()
      ) {
        await this.claim()
      } else {
        data.showMismatchAddressModal = true
      }
    },
  },
}
</script>
