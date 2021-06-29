<template>
  <form id="crossForm" name="crossForm">
    <div id="bridgeTab" class="align-center">
      <div class="firstRow row justify-content-sm-center">
        <!-- Column 2 -->
        <div class="text-center  col-sm-2">
          <label class="tokenAddress-label" for="originNetwork">Origin Network</label>
          <div class="form-group">
            <input
              id="originNetwork"
              type="text"
              name="originNetwork"
              class="form-control-plaintext text-center originNetwork"
              :class="{ disabled: !originNetwork }"
              readonly
              :value="originNetwork || 'RSK'"
            />
          </div>
        </div>

        <!-- Column 4 -->
        <div class="youOwn text-center col-sm-2">
          <label class="tokenAddress-label" for="tokenAddress">You own</label>
          <div class="input-group">
            <select
              id="tokenAddress"
              class="selectpicker"
              name="tokenAddress"
              data-width="100%"
              title="Select token"
              disabled
              required
            >
              <!-- Dinamic content made with JS -->
            </select>
          </div>
          <div class="invalid-feedback-container">
            <div class="invalid-feedback"></div>
          </div>
        </div>

        <!-- Column 6 -->
        <div class="amountToCross text-center col-sm-2">
          <label class="amount-label" for="amount"><a id="max" class="max">Max</a></label>
          <div class="form-group amount">
            <input
              id="amount"
              name="amount"
              class="outline form-control text-center"
              placeholder="Amount"
              required
            />
            <div class="invalid-feedback-container">
              <div class="invalid-feedback"></div>
            </div>
          </div>
        </div>

        <!-- Column 8 -->
        <div class="senderAddress text-center  col-sm-5">
          <label class="sender-label" for="sender-address"
            ><a id="sender" class="sender">Sender address</a></label
          >
          <div class="form-group">
            <input
              id="sender-address"
              type="text"
              name="sender-address"
              class="form-control-plaintext text-center"
              :class="{ disabled: !senderAddress }"
              readonly
              :value="senderAddress || '0x00...00'"
            />
          </div>
        </div>
      </div>

      <div class="secondRow row justify-content-sm-center">
        <!-- Column 2 -->
        <div class="text-center  col-sm-2">
          <label class="tokenAddress-label" for="destinationNetwork">Destination Network</label>
          <div class="form-group">
            <input
              id="destinationNetwork"
              type="text"
              name="destinationNetwork"
              class="form-control-plaintext text-center destinationNetwork"
              :class="{ disabled: !destinationNetwork }"
              readonly
              :value="destinationNetwork || 'Ethereum'"
            />
          </div>
        </div>

        <!-- Column 4 -->
        <div class="text-center youWillReceive col-sm-2">
          <label class="willReceive-label" for="willReceive">You will receive</label>
          <div class="input-group">
            <div id="willReceive" class="form-control-plaintext" name="willReceive">
              <span
                id="willReceiveToken"
                class="willReceiveToken"
                :class="{ disabled: !senderAddress }"
                name="willReceiveToken"
                >-</span
              >
            </div>
          </div>
        </div>

        <!-- Column 6 -->
        <div class="convertedAmount text-center col-sm-2">
          <label class="amount-label" for="amount"
            ><a id="max" class="max">Converted amount</a></label
          >
          <div class="form-group amount">
            <input
              id="receive-amount"
              name="receive-amount"
              class="form-control-plaintext text-center align-center"
              readonly
              value="0"
            />
          </div>
        </div>

        <!-- Column 8 -->
        <div class="receiverAddress text-center col-sm-5">
          <label class="receive-label-address" for="receive-address"
            ><a id="same-address" class="same-address">Receiver address</a></label
          >
          <div class="form-group receive-address">
            <input
              id="receive-address"
              type="text"
              name="receive-address"
              class="outline form-control text-center"
              placeholder="0x00...af"
            />
            <div class="invalid-feedback-container">
              <div class="invalid-feedback"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row justify-content-center">
      <div class="approve-deposit">
        <button id="approve" disabled class="btn btn-primary mr-3 mb-3">Approve</button>
      </div>
      <button id="deposit" disabled type="submit" class="btn btn-primary ml-3 mb-3">
        Convert tokens
      </button>
    </div>

    <WaitSpinner />
    <SuccessMsg />
    <ErrorMsg />
  </form>
</template>
<script>
import WaitSpinner from './messages/WaitSpinner.vue'
import SuccessMsg from './messages/SuccessMsg.vue'
import ErrorMsg from './messages/ErrorMsg.vue'

export default {
  name: 'CrossForm',
  components: {
    WaitSpinner,
    SuccessMsg,
    ErrorMsg,
  },
  props: {
    senderAddress: {
      type: String,
      default: '0x00...00',
    },
    originNetwork: {
      type: String,
      default: 'RSK',
    },
    destinationNetwork: {
      type: String,
      default: 'Ethereum',
    },
  },
}
</script>
