<template>
  <span class="voting-info pl-1 pr-1">
    <a @click="showModal = true"><i class="fas fa-info-circle"></i></a>
    <Modal v-if="showModal" @close="showModal = false">
      <template #title>
        Votes
      </template>
      <template #body>
        <table class="table">
          <thead>
            <tr>
              <th scope="col">Federator</th>
              <th scope="col">Has Voted</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="vote in votes" :key="vote.address">
              <tr>
                <td>{{ vote.address }}</td>
                <td>
                  <i v-if="vote.hasVoted" class="fas fa-check confirmed"></i>
                  <i v-else class="fas fa-times"></i>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </template>
    </Modal>
  </span>
</template>

<script>
import FEDERATION_ABI from '@/constants/abis/federation.json'
import Modal from '@/components/commons/Modal.vue'
import { store } from '@/store.js'
import { decodeCrossEvent } from '@/utils/decodeEvents'

export default {
  name: 'VotingInfo',
  components: {
    Modal,
  },
  props: {
    fedMembers: {
      type: Array,
      required: true,
    },
    transaction: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      sharedState: store.state,
      showModal: false,
      votes: [],
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
    destinationWeb3() {
      return this.toNetwork.isRsk ? this.sharedState.rskWeb3 : this.sharedState.ethWeb3
    },
    originWeb3() {
      return this.fromNetwork.isRsk ? this.sharedState.rskWeb3 : this.sharedState.ethWeb3
    },
    federationAddress() {
      return this.toNetwork.federation
    },
  },
  watch: {
    fedMembers() {
      this.setVotesFromFedMembers()
    },
  },
  created() {
    this.setVotesFromFedMembers()
  },
  methods: {
    async setVotesFromFedMembers() {
      const data = this
      if (!data.originWeb3 || !data.destinationWeb3 || !data.federationAddress || !data.fedMembers)
        return

      const receipt = await data.originWeb3.eth.getTransactionReceipt(
        data.transaction.transactionHash,
      )
      const { event, decodedEvent } = decodeCrossEvent(data.originWeb3, receipt)
      const federationContract = new data.destinationWeb3.eth.Contract(
        FEDERATION_ABI,
        data.federationAddress,
      )
      const txDataHash = await federationContract.methods
        .getTransactionId(
          decodedEvent._tokenAddress,
          decodedEvent._from,
          decodedEvent._to,
          decodedEvent._amount,
          event.blockHash,
          event.transactionHash,
          event.logIndex,
        )
        .call()

      const votesPromises = []
      for (const memberAddress of data.fedMembers) {
        votesPromises.push(federationContract.methods.votes(txDataHash, memberAddress).call())
      }
      const allVotes = await Promise.all(votesPromises)
      data.votes = allVotes.map((hasVoted, i) => {
        return {
          address: data.fedMembers[i],
          hasVoted: hasVoted,
        }
      })
    },
  },
}
</script>
