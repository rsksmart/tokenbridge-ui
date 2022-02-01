import BigNumber from 'bignumber.js'
import Modal from '@/components/commons/Modal.vue'
import { store } from '@/store.js'
import { wrappedFormat, blocksToTime, sanitizeTxHash, NULL_HASH } from '@/utils'
import { CROSSING_STEPS } from '@/constants/enums.js'
import VotingInfo from './../VotingInfo.vue'
import { ESTIMATED_GAS_AVG } from '@/constants/transactions'
import globalStore from '@/stores/global.store'
import { TOKEN_TYPE_ERC_20, TOKEN_TYPE_ERC_721 } from '@/constants/tokenType'
import ERC20TokenTransaction from '@/modules/transactions/transactionsTypes/ERC20TokenTransaction'
import ERC721NFTTransaction from '@/modules/transactions/transactionsTypes/ERC721NFTTransaction'
import { decodeCrossEvent } from '@/utils/decodeEvents'
import { findNetworkByChainId } from '@/constants/networks'
import WrongNetwork from '@/components/transactions/modals/WrongNetwork'
import ClaimWRBTCModal from '../modals/ClaimWRBTCModal'
import { CLAIM_TYPES } from '@/constants/claimTypes'

const DEFAULT_COPY_ICON = 'far fa-clipboard'

export default {
  components: {
    Modal,
    VotingInfo,
    ClaimWRBTCModal,
  },
  inject: ['$services', '$modal'],
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
    sideConfirmations: {
      type: Object,
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
    rskFedMembers: {
      type: Array,
      required: true,
    },
    sideFedMembers: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      sharedState: store.state,
      globalState: globalStore.state,
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
      return findNetworkByChainId(this.transaction.networkId, this.transaction.destinationChainId)
    },
    toNetwork() {
      return findNetworkByChainId(this.transaction.destinationChainId, this.transaction.networkId)
    },
    web3() {
      return this.toNetwork.isRsk ? this.sharedState.rskWeb3 : this.sharedState.sideWeb3
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
      return this.fromNetwork.isRsk ? this.rskBlockNumber : this.sideBlockNumber
    },
    fedMembers() {
      return this.fromNetwork.isRsk ? this.rskFedMembers : this.sideFedMembers
    },
    token() {
      return this.fromNetwork.tokens.find(token => token?.symbol === this.transaction.tokenFrom)
    },
    neededConfirmations() {
      if (!this.token) {
        return false
      }
      const limits = this.typesLimits[this.token.typeId]
      if (!limits) {
        return false
      }
      const confirmations = this.fromNetwork.isRsk ? this.rskConfirmations : this.sideConfirmations
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
    sideBlockNumber() {
      if (!this.fromNetwork.isSide) return
      this.refreshStep()
    },
    transaction() {
      this.currentStep = this.transaction.currentStep || 0
      this.txDataHash = NULL_HASH
      this.loading = false
      this.error = ''
      this.refreshStep().then(() => {})
    },
  },
  async created() {
    await this.refreshStep()
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
    async handleCopy(value) {
      await navigator.clipboard.writeText(value)
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
    getTokenTypeInstance({ web3, config } = {}) {
      switch (this.globalState.currentTokenType) {
        case TOKEN_TYPE_ERC_20:
          return new ERC20TokenTransaction({
            web3: web3 || this.sharedState?.web3,
            config: config || this.sharedState?.currentConfig,
          })
        case TOKEN_TYPE_ERC_721:
          return new ERC721NFTTransaction({
            web3: web3 || this.sharedState?.web3,
            config: config || this.sharedState?.currentConfig,
          })
        default:
          return new ERC20TokenTransaction({
            web3: web3 || this.sharedState?.web3,
            config: config || this.sharedState?.currentConfig,
          })
      }
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
      const tokenInstance = this.getTokenTypeInstance({ web3: this.web3 })
      if (data.transaction.blockNumber < data.fromNetwork.v2UpdateBlock) {
        // V1 Protocol
        data.currentStep = data.steps.Claimed
        data.estimatedTime = ''
        return
      } else if (data.currentStep === data.steps.Voting && data.txDataHash === NULL_HASH) {
        // V2 Protocol
        try {
          data.txDataHash = await tokenInstance.transactionDataHashes(
            data.transaction.transactionHash,
            data.toNetwork,
          )
        } catch (dataHashError) {
          console.error('DataHashError', dataHashError)
        }

        if (data.txDataHash !== NULL_HASH) {
          data.estimatedTime = ''
          try {
            const claimed = await tokenInstance.claimed(data.txDataHash, data.toNetwork)
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
          } catch (claimedError) {
            console.error('Fail on Claimed', claimedError)
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
      const originWeb3 = data.fromNetwork.isRsk ? sharedState.rskWeb3 : sharedState.sideWeb3
      // Always retrieve transaction block hash as data.transaction.blockHash
      // may not be the final block hash in RSK
      const receipt = await originWeb3.eth.getTransactionReceipt(data.transaction.transactionHash)
      const { decodedEvent, event } = decodeCrossEvent(
        originWeb3,
        receipt,
        this.globalState.currentTokenType,
      )
      const tokenInstance = this.getTokenTypeInstance({ config: data.toNetwork })

      try {
        const claimReceipt = await tokenInstance.claim(
          tokenInstance.getClaimData(decodedEvent, event),
          { from: sharedState.accountAddress, gas: ESTIMATED_GAS_AVG },
        )
        if (claimReceipt) {
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
    async updateRBTTransaction({ transactionHash }) {
      await this.$services.TransactionService.saveTransaction({
        ...this.transaction,
        currentStep: CROSSING_STEPS.ClaimedUsingSwap,
      })
      this.$modal.value.showModal({
        type: 'success',
        options: {
          modalProps: {
            message: `Claimed transaction <a href="${this.sharedState.currentConfig.explorer}/tx/${transactionHash}">see the transaction</a>`,
          },
        },
      })
    },
    async onCloseClaimModal(claimType, ...params) {
      switch (claimType) {
        case CLAIM_TYPES.STANDARD:
          await this.claim()
          break
        case CLAIM_TYPES.CONVERT_TO_RBTC:
          await this.updateRBTTransaction(...params)
          break
        default:
          break
      }
    },
    async claimWBTC() {
      this.$modal.value.showModal({
        type: 'custom',
        options: {
          customModalComponent: ClaimWRBTCModal,
          modalProps: {
            transaction: this.transaction,
          },
          modalEvents: {
            onCloseClaimModal: this.onCloseClaimModal,
          },
          size: 'medium',
        },
      })
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
        this.$modal.value.showModal({
          type: 'custom',
          options: {
            customModalComponent: WrongNetwork,
            modalProps: { networkConfig: this.toNetwork },
          },
        })
        return
      }
      if (
        sharedState.accountAddress.toLowerCase() === data.transaction.receiverAddress.toLowerCase()
      ) {
        await this.claimWBTC()
        // await this.claim()
      } else {
        data.showMismatchAddressModal = true
      }
    },
  },
}
