<template>
  <form id="crossForm" name="crossForm">
    <div id="bridgeTab" class="align-center">

        <div class="firstRow">
          <!-- Column 2 -->
          <div class="originNetwork text-center">
            {{ originNetwork }}
          </div>

          <!-- Column 4 -->
          <div class="youOwn text-center">
            <label class="tokenAddress-label" for="tokenAddress">You own</label>
            <div class="input-group">
                <select class="selectpicker" id="tokenAddress" name="tokenAddress" data-width="100%" title="Select token" disabled required>
                    <!-- Dinamic content made with JS -->
                </select>
            </div>
            <div class="invalid-feedback"></div>
          </div>

          <!-- Column 6 -->
          <div class="amountToCross text-center">
            <label class="amount-label" for="amount"><a id="max" class="max">Max</a></label>
            <div class="form-group amount">
              <input name="amount" id="amount" class="outline form-control text-center align-center" placeholder="Amount" required>
              <div class="invalid-feedback"></div>
            </div>
          </div>

          <!-- Column 8 -->
          <div class="senderAddress text-center">
            <label class="sender-label" for="sender-address"><a id="sender" class="sender">Sender address</a></label>
            <div class="form-group">
              <input type="text" name="sender-address" id="sender-address" class="outline form-control text-center align-center" readonly :value="senderAddress" >
            </div>
          </div>
        </div>

        <div class="secondRow">

          <!-- Column 2 -->
          <div class="destinationNetwork text-center">
            {{ destinationNetwork }}
          </div>

          <!-- Column 4 -->
          <div class="text-center youWillReceive">
              <label class="willReceive-label" for="willReceive">You will receive</label>
              <div class="input-group">
                <div class="form-control-plaintext" id="willReceive" name="willReceive">
                  <span id="willReceiveToken" class="willReceiveToken" name="willReceiveToken"></span>
                </div>
              </div>
          </div>

          <!-- Column 6 -->
          <div class="convertedAmount text-center">
            <label class="amount-label" for="amount"><a id="max" class="max">Converted amount</a></label>
            <div class="form-group amount">
              <input name="receive-amount" id="receive-amount" class="outline form-control text-center align-center" readonly value="">
            </div>
          </div>

          <!-- Column 8 -->
          <div class="receiverAddress text-center">
            <label class="amount-label" for="amount"><a id="max" class="max">Receiver address</a></label>
            <div class="form-group receive-address">
              <input type="text" name="receive-address" id="receive-address" class="outline form-control text-center align-center" placeholder="0x00...af">
              <div class="invalid-feedback"></div>
            </div>
          </div>


        </div>

    </div>

    <div class="row justify-content-center">
        <div class="approve-deposit">
            <button disabled id="approve" class="btn btn-primary mr-3 mb-3">Approve</button>
        </div>
        <button disabled id="deposit" type="submit" class="btn btn-primary ml-3 mb-3">Convert tokens</button>
    </div>

    <WaitSpinner />
    <SuccessMsg />
    <ErrorMsg />
  </form>
</template>
<script>
import WaitSpinner from '@/components/crossForm/components/waitSpinner/WaitSpinner.vue'
import SuccessMsg from '@/components/crossForm/components/successMsg/SuccessMsg.vue'
import ErrorMsg from '@/components/crossForm/components/errorMsg/ErrorMsg.vue'

export default {
  name: 'CrossFormHorizontal',
  props: {
    senderAddress: {
      type: String,
      default: '0x00...00'
    },
    originNetwork: {
      type: String,
      default: 'From Network'
    },
    destinationNetwork: {
      type: String,
      default: 'To Network'
    }
  },
  components: {
    WaitSpinner,
    SuccessMsg,
    ErrorMsg
  }
}
</script>
<style scoped>
#bridgeTab {
  min-width: 600px;
  min-height: 250px;
  display: grid;
  grid-template-rows: 20px 1fr 20px 1fr 20px;
  border: 2px solid #00B520;
  border-radius: 10px;
  margin-top: 3em;
  margin-bottom: 3em;
}

.firstRow,
.secondRow {
  display: grid;
  grid-template-columns: 10px 1fr 10px 1fr 10px 1fr 10px 3fr 20px;
  align-items: center;
  justify-items: stretch;
}

.firstRow {
  grid-row-start: 2;
  height: 100px;
}

.secondRow {
  grid-row-start: 4;
}

.originNetwork, 
.destinationNetwork {
  grid-column-start: 2;
  color: #00B520;
  font-size: 1.5em;
  font-weight: 400;
  font-family: 'Quicksand', sans-serif;
}

.youWillReceive,
.youOwn {
  grid-column-start: 4;
}

.amountToCross,
.convertedAmount {
  grid-column-start: 6;
}

.senderAddress,
.receiverAddress {
  grid-column-start: 8;
}


</style>
