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
      <div v-else-if="currentStep === steps.ClaimedUsingSwap">
        <span class="confirmed claimed">Claimed with Swap</span>
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
      <template #title> Connection problem </template>
      <template #body>
        <p>{{ connectionProblem }}</p>
      </template>
    </Modal>
    <Modal v-if="showMismatchAddressModal" @close="showMismatchAddressModal = false">
      <template #title> Receiver address is not the current account </template>
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
        <button class="btn btn-primary modal-default-button" @click="claim()">Yes</button>
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
import TransactionRowMixin from '@/components/transactions/mixins/TransactionRowMixin'

export default {
  name: 'ERC20TransactionRow',
  mixins: [TransactionRowMixin],
}
</script>
