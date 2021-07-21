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
    </td>
    <td>{{ transaction.blockNumber }}</td>
    <td>{{ `${transaction.amount} ${transaction.tokenFrom}` }}</td>
    <td :class="{ bold: isReceiverNetwork }">{{ toNetwork.name }}</td>
    <td>
      <a :href="receiverAddressExplorerUrl" :class="{ bold: isReceiverAddress }" target="_blank">
        {{ formattedReceiverAddress }}
      </a>
    </td>
    <td>
      <div v-if="currentStep == steps.Pending">
        <span class="pending">
          Pending {{ currentConfirmations }}/{{ neededConfirmations }} blocks
          <br />
          ~ {{ estimatedTime }}
        </span>
      </div>
      <div v-else-if="currentStep == steps.Voting">
        <span class="pending"> Voting ~ {{ estimatedTime }} </span>
      </div>
      <div v-else-if="currentStep == steps.ToClaim">
        <div v-if="!loading" class="to-claim">
          <button class="btn btn-primary claim" @click="claimClick">Claim</button>
        </div>
        <div v-else>
          <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
          <span class="sr-only">Loading...</span>
        </div>
      </div>
      <div v-else-if="currentStep == steps.Claimed">
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
  </tr>
</template>

<script>
import Modal from '@/components/commons/Modal.vue'
import { store } from '@/store.js'
import {
  wrappedFormat,
  blocksToTime,
  waitForReceipt,
  sanitizeTxHash,
  retry3Times,
  NULL_HASH,
  TXN_Storage,
} from '@/utils'
// import FEDERATION_ABI from '@/constants/abis/federation.json'
import BRIDGE_ABI from '@/constants/abis/bridge.json'

export default {
  name: 'TransactionRow',
  components: {
    Modal,
  },
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
    fedMembersLen: {
      type: Number,
      required: true,
    },
  },
  setup() {
    if (TXN_Storage.isStorageAvailable('localStorage')) {
      console.log(`Local Storage Available!`)
    } else {
      console.log(`Local Storage Unavailable!`)
    }
  },
  data() {
    return {
      sharedState: store.state,
      currentStep: this.transaction.currentStep || 0,
      steps: {
        Pending: 0,
        Voting: 1,
        ToClaim: 2,
        Claimed: 3,
      },
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
    }
  },
  computed: {
    fromNetwork() {
      return this.transaction.networkId == this.sharedState.rskConfig.networkId
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
      return this.fromNetwork.networkId == this.sharedState.currentConfig?.networkId
    },
    isReceiverNetwork() {
      return this.toNetwork.networkId == this.sharedState.currentConfig?.networkId
    },
    isSenderAddress() {
      return (
        this.transaction.senderAddress?.toLowerCase() ==
          this.sharedState.accountAddress?.toLowerCase() && this.isSenderNetwork
      )
    },
    isReceiverAddress() {
      return (
        this.transaction.receiverAddress?.toLowerCase() ==
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
    token() {
      return this.sharedState.tokens.find(
        x => x[this.transaction.networkId].symbol == this.transaction.tokenFrom,
      )
    },
    neededConfirmations() {
      const limits = this.typesLimits[this.token.typeId]
      const confirmations = this.fromNetwork.isRsk ? this.rskConfirmations : this.ethConfirmations
      return this.transaction.amount < limits.mediumAmount
        ? confirmations.smallAmount
        : this.transaction.amount < limits.largeAmount
        ? confirmations.mediumAmount
        : confirmations.largeAmount
    },
    txExplorerLink() {
      const sanitizedTxHash = sanitizeTxHash(this.claimTxHash)
      return `${this.sharedState.currentConfig.explorer}/tx/${sanitizedTxHash}`
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
  },
  created() {
    this.refreshStep()
  },
  methods: {
    async refreshStep() {
      const data = this
      if (data.currentStep >= data.steps.ToClaim) return
      if (data.currentStep == data.steps.Pending) {
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
      } else if (data.currentStep == data.steps.Voting && data.txDataHash == NULL_HASH) {
        // V2 Protocol

        // TODO get the votation count and show it to the user
        // if (data.currentStep == data.steps.Voting) {
        //   const federationContract = new data.web3.eth.Contract(
        //     FEDERATION_ABI,
        //     data.toNetwork.federation,
        //   )
        //   data.votesCount = await federationContract.methods.getTransactionCount(hash).call()
        //   if (data.votesCount < data.fedMembersLen) {
        //     data.currentStep = data.steps.Voting
        //     data.estimatedTime = '2 minutes'
        //   } else {
        //     data.currentStep = data.steps.ToClaim
        //     data.estimatedTime = ''
        //   }
        // }

        data.txDataHash = await retry3Times(
          bridgeContract.methods.transactionsDataHashes(data.transaction.transactionHash).call,
        )
        if (data.txDataHash != NULL_HASH) {
          data.estimatedTime = ''
          const claimed = await retry3Times(bridgeContract.methods.claimed(data.txDataHash).call)
          if (claimed) {
            data.currentStep = data.steps.Claimed
            TXN_Storage.updateTxn(
              data.sharedState.accountAddress,
              data.fromNetwork.localStorageName,
              { currentStep: data.currentStep, ...data.transaction },
            )
          } else {
            data.currentStep = data.steps.ToClaim
          }
        }
      }
    },
    async claimClick() {
      const data = this
      if (!data.sharedState.isConnected) {
        data.connectionProblem = `Wallet not connected. You need to connect your wallet to ${data.toNetwork.name}`
        data.showConnectionProblemModal = true
        return
      }
      if (data.sharedState.currentConfig.networkId != this.toNetwork.networkId) {
        data.connectionProblem = `Wrong network. To claim this tokens you need to connect your wallet to ${data.toNetwork.name}`
        data.showConnectionProblemModal = true
        return
      }
      if (
        data.sharedState.accountAddress.toLowerCase() !=
        data.transaction.receiverAddress.toLowerCase()
      ) {
        data.connectionProblem = `You are trying to claim a transaction for another address ${data.transaction.receiverAddress}`
        data.showConnectionProblemModal = true
        return
      }
      data.loading = true
      const originWeb3 = data.fromNetwork.isRsk
        ? data.sharedState.rskWeb3
        : data.sharedState.ethWeb3
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
      const bridgeContract = new data.sharedState.web3.eth.Contract(
        BRIDGE_ABI,
        data.toNetwork.bridge,
      )

      return new Promise((resolve, reject) => {
        bridgeContract.methods
          .claim({
            to: decodedEvent._to,
            amount: decodedEvent._amount,
            blockHash: event.blockHash,
            transactionHash: event.transactionHash,
            logIndex: event.logIndex,
          })
          .send(
            { from: data.sharedState.accountAddress, gasPrice: gasPrice, gas: 250_000 },
            async (err, txHash) => {
              data.claimTxHash = txHash
              if (err) {
                return reject(new Error(`Execution failed ${err.message}`))
              }
              try {
                const receipt = await waitForReceipt(txHash, data.web3)
                if (receipt.status) {
                  return resolve(receipt)
                } else {
                  return reject(new Error(`Transaction status failed ${err.message}`))
                }
              } catch (error) {
                return reject(new Error(`Unexpected error ${err.message}`))
              }
            },
          )
      })
        .then(() => {
          data.currentStep = data.steps.Claimed
          data.loading = false
          data.error = ''
          data.showResultModal = true
        })
        .catch(err => {
          data.loading = false
          data.error = err.message
          data.showResultModal = true
          console.error(err)
          //crossTokenError(`Couldn't Claim. ${err.message}`)
        })
    },
  },
}

// async function showActiveAddressTXNs() {
//   if (!address || (!activeAddressEth2RskTxns.length && !activeAddressRsk2EthTxns.length)) {
//     return
//   }

//   $('#txn-previous')
//     .off()
//     .on('click', onPreviousTxnClick)
//   $('#txn-next')
//     .off()
//     .on('click', onNextTxnClick)

//   let eth2RskTable = $('#eth-rsk-tbody')
//   let rsk2EthTable = $('#rsk-eth-tbody')

//   eth2RskPaginationObj = Paginator(activeAddressEth2RskTxns, eth2RskTablePage, 3)
//   let { data: eth2RskTxns } = eth2RskPaginationObj

//   rsk2EthPaginationObj = Paginator(activeAddressRsk2EthTxns, rsk2EthTablePage, 3)
//   let { data: rsk2EthTxns } = rsk2EthPaginationObj

//   const processTxn = async (txn, networkConfig, blockNumber, sideWeb3) => {
//     const { confirmations, secondsPerBlock, explorer } = networkConfig

//     let elapsedBlocks = blockNumber - txn.blockNumber
//     let remainingBlocks2Confirmation = confirmations - elapsedBlocks
//     let status = 'Info Not Available'
//     if (txn.blockNumber > networkConfig.v2UpdateBlock) {
//       // V2 Protocol
//       const sideBridgeContract = new sideWeb3.eth.Contract(
//         BRIDGE_ABI,
//         networkConfig.crossToNetwork.bridge,
//       )
//       const txDataHash = await sideBridgeContract.methods
//         .transactionsDataHashes(txn.transactionHash)
//         .call()
//       if (txDataHash === NULL_HASH) status = '<span class="pending"> Pending</span>'
//       else {
//         const claimed = await sideBridgeContract.methods.claimed(txDataHash).call()
//         if (claimed) {
//           status = '<span class="confirmed"> Claimed</span>'
//         } else {
//           status = '<span><button class="btn btn-primary claim">Claim</button></span>'
//         }
//       }
//     } else {
//       // V1 Protocol
//       status =
//         elapsedBlocks >= confirmations
//           ? `<span class="confirmed"> Confirmed</span>`
//           : `<span class="pending"> Pending</span>`
//     }

//     let seconds2Confirmation =
//       remainingBlocks2Confirmation > 0 ? remainingBlocks2Confirmation * secondsPerBlock : 0

//     let hoursToConfirmation = Math.floor(seconds2Confirmation / 60 / 60)
//     let hoursToConfirmationStr = hoursToConfirmation > 0 ? `${hoursToConfirmation}hs ` : ''
//     let minutesToConfirmation = Math.floor(seconds2Confirmation / 60) - hoursToConfirmation * 60
//     let humanTimeToConfirmation =
//       elapsedBlocks < confirmations
//         ? `| ~ ${hoursToConfirmationStr} ${minutesToConfirmation}mins`
//         : ''

//     let txnExplorerLink = `${explorer}/tx/${txn.transactionHash}`
//     let shortTxnHash = `${txn.transactionHash.substring(0, 8)}...${txn.transactionHash.slice(-8)}`

//     let htmlRow = `<tr class="black">
//                 <th scope="row"><a href="${txnExplorerLink}">${shortTxnHash}</a></th>
//                 <td>${txn.blockNumber}</td>
//                 <td>${txn.amount} ${txn.tokenFrom}</td>
//                 <td>${status} ${humanTimeToConfirmation}</td>
//             </tr>`

//     return htmlRow
//   }

//   let rskConfig = config
//   let ethConfig = config.crossToNetwork
//   let rskWeb3 = vNode.sharedState.web3
//   let ethWeb3 = new Web3(config.crossToNetwork.rpc)
//   let rskBlockNumber = currentBlockNumber
//   let ethBlockNumber = await ethWeb3.eth.getBlockNumber()
//   if (config.name.toLowerCase().includes('eth')) {
//     rskConfig = config.crossToNetwork
//     ethConfig = config
//     rskWeb3 = new Web3(config.crossToNetwork.rpc)
//     ethWeb3 = vNode.sharedState.web3
//     rskBlockNumber = await rskWeb3.eth.getBlockNumber()
//     ethBlockNumber = currentBlockNumber
//   }
//   const activeAddressTXNsEth2RskRowsPromises = Promise.all(
//     eth2RskTxns.map(txn => {
//       return processTxn(txn, ethConfig, ethBlockNumber, rskWeb3)
//     }),
//   )
//   const activeAddressTXNsRsk2EthRowsPromises = Promise.all(
//     rsk2EthTxns.map(txn => {
//       return processTxn(txn, rskConfig, rskBlockNumber, ethWeb3)
//     }),
//   )

//   const activeAddressTXNsEth2RskRows = await activeAddressTXNsEth2RskRowsPromises
//   const activeAddressTXNsRsk2EthRows = await activeAddressTXNsRsk2EthRowsPromises
//   eth2RskTable.html(activeAddressTXNsEth2RskRows.join())
//   rsk2EthTable.html(activeAddressTXNsRsk2EthRows.join())
// }
</script>
