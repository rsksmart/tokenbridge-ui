<template>
  <div class="important-details mt-5 mb-5">
    <h2 id="important-details" class="subtitle">Important details</h2>
    <table class="table">
      <thead>
        <tr>
          <th scope="col"></th>
          <th scope="col">{{ sharedState.rskConfig.name }}</th>
          <th scope="col">{{ sharedState.ethConfig.name }}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row">Fee</th>
          <td>{{ rskFeeFormated }}</td>
          <td>{{ ethFeeFormated }}</td>
        </tr>
        <tr>
          <th scope="row">Avarage seconds per block</th>
          <td>~ {{ sharedState.rskConfig.secondsPerBlock }} seconds</td>
          <td>~ {{ sharedState.ethConfig.secondsPerBlock }} seconds</td>
        </tr>
        <tr>
          <th scope="row">Confirmations needed for small amounts</th>
          <td>
            {{ rskConfirmations?.smallAmount }} blocks (~ {{ rskConfirmations?.smallAmountTime }}) +
            2 minutes voting
          </td>
          <td>
            {{ ethConfirmations?.smallAmount }} blocks (~ {{ ethConfirmations?.smallAmountTime }}) +
            2 minutes voting
          </td>
        </tr>
        <tr>
          <th scope="row">Confirmations needed for medium amounts</th>
          <td>
            {{ rskConfirmations?.mediumAmount }} blocks (~ {{ rskConfirmations?.mediumAmountTime }})
            + 2 minutes voting
          </td>
          <td>
            {{ ethConfirmations?.mediumAmount }} blocks (~ {{ ethConfirmations?.mediumAmountTime }})
            + 2 minutes voting
          </td>
        </tr>
        <tr>
          <th scope="row">Confirmations needed for large amounts</th>
          <td>
            {{ rskConfirmations?.largeAmount }} blocks (~ {{ rskConfirmations?.largeAmountTime }}) +
            2 minutes voting
          </td>
          <td>
            {{ ethConfirmations?.largeAmount }} blocks (~ {{ ethConfirmations?.largeAmountTime }}) +
            2 minutes voting
          </td>
        </tr>
        <tr>
          <th scope="row">Signatories</th>
          <td>{{ rskFedMembersLen }}</td>
          <td>{{ ethFedMembersLen }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { store } from '@/store.js'

export default {
  name: 'ImportantDetails',
  props: {
    rskFee: {
      type: Number,
      required: true,
    },
    ethFee: {
      type: Number,
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
    }
  },
  computed: {
    rskFeeFormated() {
      return this.rskFee * 100 + '%'
    },
    ethFeeFormated() {
      return this.ethFee * 100 + '%'
    },
    rskFedMembersLen() {
      return this.rskFedMembers.length
    },
    ethFedMembersLen() {
      return this.ethFedMembers.length
    },
  },
}
</script>
