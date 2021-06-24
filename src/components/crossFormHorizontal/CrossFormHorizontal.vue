<template>
  <form id="crossForm" name="crossForm">
    <div id="bridgeTab" class="align-center">

        <div class="firstRow">
          <div class="originNetwork">
            RSK Testnet
          </div>
          <div class="youOwn text-center">
            <label class="tokenAddress-label" for="tokenAddress">You own</label>
            <div class="input-group">
                <select class="selectpicker" id="tokenAddress" name="tokenAddress" data-width="100%" title="Select token" disabled required>
                    <!-- Dinamic content made with JS -->
                </select>
            </div>
            <div class="invalid-feedback"></div>
          </div>
          <div class="text-center youWillReceive">
              <label class="willReceive-label" for="willReceive">You will receive</label>
              <div class="input-group">
                <div class="form-control-plaintext" id="willReceive" name="willReceive">
                  <span id="willReceiveToken" class="willReceiveToken" name="willReceiveToken"></span>
                </div>
              </div>
          </div>
          <div class="amountToCross text-center">
            <label class="amount-label" for="amount"><a id="max" class="max">Max</a></label>
            <div class="form-group amount">
              <input name="amount" id="amount" class="outline form-control text-center align-center" placeholder="Amount" required>
              <div class="invalid-feedback"></div>
            </div>
          </div>
        </div>

        <div class="secondRow">

          <div class="destinationNetwork text-center">
            RSK Testnet
          </div>

          <div class="receiverAddress text-center">
            <label class="amount-label" for="amount"><a id="max" class="max">Receiver address</a></label>
            <div class="form-group amount">
              <input type="text" name="receive-address" id="receive-address" class="outline form-control text-center align-center" placeholder="0x00...af">
              <div class="invalid-feedback"></div>
            </div>
          </div>

          <div class="convertedAmount text-center">
            <label class="amount-label" for="amount"><a id="max" class="max">Converted amount</a></label>
            <div class="form-group amount">
              <input name="receive-amount" id="receive-amount" class="outline form-control text-center align-center" readonly value="">
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
  name: 'Bridge',
  components: {
    WaitSpinner,
    SuccessMsg,
    ErrorMsg
  }
}
</script>
<style scoped>
#bridgeTab {
  max-width: 760px;
  min-height: 250px;
  display: grid;
  grid-template-rows: 20px 1fr 20px 1fr 20px;
  border: 2px solid #00B520;
  border-radius: 10px;
  margin-top: 3em;
  margin-bottom: 3em;
}

.firstRow {
  grid-row-start: 2;
  display: grid;
  /*grid-template-columns: 20px 80px 10px 1fr 10px 1fr 10px 150px 20px;*/
  grid-template-columns: 10px 1fr 10px 1fr 10px 1fr 10px 1fr 20px;
  justify-items: center;
  align-items: center;
  height: 100px;
}

.secondRow {
  display: grid;
  /*grid-template-columns: 20px 80px 10px 1fr 10px 150px 20px;*/
  grid-template-columns: 10px 1fr 10px 2fr 10px 1fr 20px;
  grid-row-start: 4;
  align-items: center;
}

.receiverAddress {
  grid-column-start: 4;
}

.convertedAmount {
  grid-column-start: 6;
}

.originNetwork, 
.destinationNetwork {
  grid-column-start: 2;
}

.youOwn {
  grid-column-start: 4;
}

.youWillReceive {
  grid-column-start: 6;
}

.amountToCross {
  grid-column-start: 8;
}
</style>
