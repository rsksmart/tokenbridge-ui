<template>
  <div
    v-if="show"
    id="success"
    class="mt-3 align-center text-center alert alert-dismissible fade show"
    style="display:none;"
  >
    <div class="outline-rounded">
      <div style="font-size: 32px;"><i class="fas fa-check"></i></div>
      <div>
        You will receive
        <span id="receive" class="black"> {{ receiveAmount }} {{ receiveToken }} </span>
        in your wallet in {{ confirmations }} blocks
        <span id="confirmationTime"> aproximately {{ confirmationsTime }}</span>
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

export default {
  name: 'SuccessMsg',
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    confirmations: {
      type: Number,
      required: true,
    },
    receiveAmount: {
      type: Number,
      required: true,
    },
    receiveToken: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      sharedState: store.state,
    }
  },
  computed: {
    confirmationsTime() {
      return blocksToTime(this.confirmations, this.sharedState.currentConfig?.secondsPerBlock)
    },
  },
}
</script>
