<template>
  <div
    v-if="show"
    id="success"
    class="mt-3 align-center text-center alert alert-dismissible fade show"
  >
    <div class="outline-rounded">
      <div style="font-size: 32px"><i class="fas fa-check"></i></div>
      <div>
        You will be able to claim for your 
        <span id="receive" class="black"> {{ valueAmount }} {{ tokenName }} </span>
        after {{ blocks }} blocks
        <span id="confirmationTime"> aproximately {{ time }}</span>
       <router-link to="transactions">
        <p>Your transactions</p>
      </router-link>
      </div>
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  </div>
</template>
<script>
import { store } from '@/store.js'
import { blocksToTime } from '@/utils'
import BigNumber from 'bignumber.js'

export default {
  name: 'SuccessMsg',
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    confirmations: {
      type: Object,
      required: false,
    },
    receiveAmount: {
      type: BigNumber,
      required: false,
    },
    receiveToken: {
      type: String,
      required: false,
    },
  },
  data() {
    return {
      sharedState: store.state,
      tokenName: '',
      blocks: 0,
      time: 0,
      valueAmount: 0
    }
  },
  computed: {
    confirmationsTime() {
      return blocksToTime(this.confirmations, this.sharedState.currentConfig?.secondsPerBlock)
    },
  },
  watch: {
    confirmations: function(newValue) {
      if ('blocks' in newValue) {
        this.blocks = newValue.blocks;
        this.time = newValue.time;
      }
    },
    receiveAmount: function(newValue) {
      if (newValue.toString() !== '0') {
        this.valueAmount = newValue.toString();
      }
    },
    receiveToken: function(newValue) {
      if (newValue !== '') {
        this.tokenName = newValue;
      }
    },
  }
}
</script>
