<template>
  <div class="important-details main-div">
    <h2 id="important-details" class="subtitle">Important details</h2>
    <table class="table">
      <thead>
        <tr>
          <th scope="col"></th>
          <th scope="col">{{ sharedState.rskConfig?.name }}</th>
          <th scope="col">{{ sharedState.sideConfig?.name }}</th>
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
          <td>~ {{ sharedState.rskConfig?.secondsPerBlock }} seconds</td>
          <td>~ {{ sharedState.sideConfig?.secondsPerBlock }} seconds</td>
        </tr>
        <tr>
          <th scope="row">Confirmations needed for small amounts</th>
          <td>
            {{ rskConfirmations?.smallAmount }} blocks (~ {{ rskConfirmations?.smallAmountTime }}) +
            {{ votingTime }}
          </td>
          <td>
            {{ sideConfirmations?.smallAmount }} blocks (~ {{ sideConfirmations?.smallAmountTime }})
            +
            {{ votingTime }}
          </td>
        </tr>
        <tr>
          <th scope="row">Confirmations needed for medium amounts</th>
          <td>
            {{ rskConfirmations?.mediumAmount }} blocks (~ {{ rskConfirmations?.mediumAmountTime }})
            + {{ votingTime }}
          </td>
          <td>
            {{ sideConfirmations?.mediumAmount }} blocks (~
            {{ sideConfirmations?.mediumAmountTime }}) + {{ votingTime }}
          </td>
        </tr>
        <tr>
          <th scope="row">Confirmations needed for large amounts</th>
          <td>
            {{ rskConfirmations?.largeAmount }} blocks (~ {{ rskConfirmations?.largeAmountTime }}) +
            {{ votingTime }}
          </td>
          <td>
            {{ sideConfirmations?.largeAmount }} blocks (~ {{ sideConfirmations?.largeAmountTime }})
            +
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
  name: 'ImportantDetailsErc20',
  props: {
    rskFee: {
      type: Number,
      required: true,
    },
    sideFee: {
      type: Number,
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
  },
  data() {
    return {
      sharedState: store.state,
    }
  },
  computed: {
    votingTime() {
      return '3 minutes voting'
    },
    rskFeeFormated() {
      return this.rskFee * 100 + '%'
    },
    sideFeeFormated() {
      return this.sideFee * 100 + '%'
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
