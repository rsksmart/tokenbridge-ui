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
                <td>{{ vote.hasVoted }}</td>
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
    txDataHash: {
      type: String,
      required: true,
    },
    federationAddress: {
      type: String,
      required: true,
    },
    web3: {
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
  watch: {
    fedMembers() {
      this.setVotesFromFedMembers()
    },
    federationAddress() {
      this.setVotesFromFedMembers()
    },
  },
  created() {
    this.setVotesFromFedMembers()
  },
  methods: {
    async setVotesFromFedMembers() {
      const data = this
      if (!data.web3 || !data.federationAddress || !data.fedMembers) return
      const federationContract = new data.web3.eth.Contract(FEDERATION_ABI, data.federationAddress)

      data.votes = []
      for (const memberAddress of data.fedMembers) {
        const hasVoted = await federationContract.methods
          .votes(data.txDataHash, memberAddress)
          .call()
        data.votes.push({
          address: memberAddress,
          hasVoted: hasVoted,
        })
      }
    },
  },
}
</script>
