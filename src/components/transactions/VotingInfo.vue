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
import globalStore from '@/stores/global.store'
import { TOKEN_TYPE_ERC_20, TOKEN_TYPE_ERC_721 } from '@/constants/tokenType'
import ERC20TokenTransaction from '@/modules/transactions/transactionsTypes/ERC20TokenTransaction'
import ERC721NFTTransaction from '@/modules/transactions/transactionsTypes/ERC721NFTTransaction'

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
      globalState: globalStore.state,
      showModal: false,
      votes: [],
    }
  },
  computed: {
    fromNetwork() {
      return this.transaction.networkId === this.sharedState.rskConfig.networkId
        ? this.sharedState.rskConfig
        : this.sharedState.sideConfig
    },
    toNetwork() {
      return this.fromNetwork.crossToNetwork
    },
    destinationWeb3() {
      return this.toNetwork.isRsk ? this.sharedState.rskWeb3 : this.sharedState.sideWeb3
    },
    originWeb3() {
      return this.fromNetwork.isRsk ? this.sharedState.rskWeb3 : this.sharedState.sideWeb3
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
  async created() {
    try {
      await this.setVotesFromFedMembers()
    } catch (error) {
      console.error(error)
    }
  },
  methods: {
    getParamsByTokenType(decodedEvent, event) {
      switch (this.globalState.currentTokenType) {
        case TOKEN_TYPE_ERC_20:
          return ERC20TokenTransaction.getParamsForGetTransactionId(decodedEvent, event, this.fromNetwork.networkId, this.toNetwork.networkId)
        case TOKEN_TYPE_ERC_721:
          // TODO: Add origin and destination network to the params..
          return ERC721NFTTransaction.getParamsForGetTransactionId(decodedEvent, event)
        default:
          throw new Error(`Token type ${this.globalState.currentTokenType} isn't supported`)
      }
    },
    async setVotesFromFedMembers() {
      const data = this
      if (!data.originWeb3 || !data.destinationWeb3 || !data.federationAddress || !data.fedMembers)
        return

      const receipt = await data.originWeb3.eth.getTransactionReceipt(
        data.transaction.transactionHash,
      )
      const { event, decodedEvent } = decodeCrossEvent(
        data.originWeb3,
        receipt,
        this.globalState.currentTokenType,
      )
      const federationContract = new data.destinationWeb3.eth.Contract(
        FEDERATION_ABI,
        data.federationAddress,
      )
      const txDataHash = await federationContract.methods
        .getTransactionId(...this.getParamsByTokenType(decodedEvent, event))
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
