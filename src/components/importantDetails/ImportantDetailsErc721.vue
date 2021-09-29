<template>
  <div class="important-details mt-5 mb-5">
    <h2 id="important-details" class="subtitle">Important details</h2>
    <table class="table">
      <thead>
        <tr>
          <th scope="col"></th>
          <th scope="col">{{ sharedState.rskConfig.name }}</th>
          <th scope="col">{{ sharedState.sideConfig.name }}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row">Fee</th>
          <td>{{ rskFeeFormated }}</td>
          <td>{{ sideFeeFormated }}</td>
        </tr>
        <tr>
          <th scope="row">Avarage seconds per block</th>
          <td>~ {{ sharedState.rskConfig.secondsPerBlock }} seconds</td>
          <td>~ {{ sharedState.sideConfig.secondsPerBlock }} seconds</td>
        </tr>
        <tr>
          <th scope="row">Confirmations needed</th>
          <td>
            {{ rskConfirmationsNft?.confirmations }} blocks (~ {{ rskConfirmationsNft?.time }}) +
            {{ votingTime }}
          </td>
          <td>
            {{ sideConfirmationsNft?.confirmations }} blocks (~ {{ sideConfirmationsNft?.time }}) +
            {{ votingTime }}
          </td>
        </tr>
        <tr>
          <th scope="row">Signatories</th>
          <td>{{ rskFedMembersLen }}</td>
          <td>{{ sideFedMembersLen }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { store } from '@/store.js'

export default {
  name: 'ImportantDetailsErc721',
  props: {
    rskFeeNft: {
      type: Number,
      required: true,
    },
    sideFeeNft: {
      type: Number,
      required: true,
    },
    rskConfirmationsNft: {
      type: Object,
      required: true,
    },
    sideConfirmationsNft: {
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
  },
  data() {
    return {
      sharedState: store.state,
    }
  },
  computed: {
    votingTime() {
      return '2 minutes voting'
    },
    rskFeeFormated() {
      return this.rskFeeNft * 100 + '%'
    },
    sideFeeFormated() {
      return this.sideFeeNft * 100 + '%'
    },
    rskFedMembersLen() {
      return this.rskFedMembers.length
    },
    sideFedMembersLen() {
      return this.sideFedMembers.length
    },
  },
}
</script>
