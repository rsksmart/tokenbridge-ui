<template>
  <form id="crossForm" name="crossForm">
    <div id="bridgeTab" class="align-center">
        <div class="leftColumn transferGridRow">
          <div class="text-center upperRow network"> 
            <div class="text-center">
              <span class="fromNetwork">From Network</span>
            </div>
           </div>
          <div class="text-center middleUpRow"> 
            <div class="text-center">
              <label class="tokenAddress-label" for="tokenAddress">You own</label>
              <div class="input-group">
                  <select class="selectpicker" id="tokenAddress" name="tokenAddress" data-width="100%" title="Select token" disabled required>
                      <!-- Dinamic content made with JS -->
                  </select>
              </div>
              <div class="invalid-feedback"></div>
            </div>
          </div>
          <div class="text-center middleBottomRow">
            <div class="amount-bottom">
              <label class="amount-label" for="amount"><a id="max" class="max">Max</a></label>
              <div class="form-group amount">
                <input name="amount" id="amount" class="outline form-control text-center align-center" placeholder="Amount" required>
                <div class="invalid-feedback"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="middleColumn transferGridRow">
          <div class="text-center upperRow"> 
            <div>
              <span id="changeNetwork" class="outline-rounded" style="padding-left: 1.5rem; padding-right: 1.5rem;">
                <i class="fas fa-exchange-alt"></i>
              </span>
            </div>
             <div class="mt-2">Estimated time to cross tokens <b id="timeToCross"></b></div>
          </div>
          <div class="text-center middleUpRow"> 
            <div class="approve-deposit">
              <button disabled id="approve" class="btn btn-primary ml-3 mr-3">Approve</button>
            </div>
          </div>
          <div class="text-center middleBottomRow"> 
            <button disbaled id="deposit" type="submit" class="btn btn-primary ml-3 mr-3">Convert tokens</button>
          </div>
        </div>

        <div class="rightColumn transferGridRow">
          <div class="text-center upperRow network"> 
            <div class="text-center">
              <span class="toNetwork">To Network</span>
            </div>
          </div>
          <div class="text-center middleUpRow">
            <div class="text-center">
              <div class="willReceive">
                <label class="willReceive-label" for="willReceive">You will receive</label>
                <div class="input-group">
                  <div class="form-control-plaintext" id="willReceive" name="willReceive">
                    <span id="willReceiveToken" class="willReceiveToken" name="willReceiveToken"></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="text-center middleBottomRow">
            <div class="amount-bottom">
              <label class="amount-label" for="amount"><a id="max" class="max">Converted amount</a></label>
              <div class="form-group amount">
                <input name="receive-amount" id="receive-amount" class="outline form-control text-center align-center" readonly value="">
                <div class="invalid-feedback"></div>
              </div>
            </div>
          </div>
          <div class="text-center bottomRow">
            <div class="amount-bottom">
              <label class="amount-label" for="amount"><a id="max" class="max">Receiver address</a></label>
              <div class="form-group amount">
                <input type="text" name="receive-address" id="receive-address" class="outline form-control text-center align-center" placeholder="0x00...af">
                <div class="invalid-feedback"></div>
              </div>
            </div>
          </div>
        </div>
    </div> <!--End of newTransferTab-->

    <WaitSpinner />
    <SuccessMsg />
    <ErrorMsg />
  </form>
</template>
<script>
import WaitSpinner from './components/waitSpinner/WaitSpinner.vue'
import SuccessMsg from './components/successMsg/SuccessMsg.vue'
import ErrorMsg from './components/errorMsg/ErrorMsg.vue'

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
  margin-bottom: 30px;
  padding: 40px 20px;
  display: grid;
  grid-template-columns: 10px 3fr 10px 2fr 10px 3fr 10px;
}

.transferGridRow {
  display: grid;
  grid-template-rows: 1em 1fr 1em 1fr 1em 1fr 1em 1fr 1em;
  align-items: center;
}

#bridgeTab .leftColumn {
  grid-column-start: 2;
}

#bridgeTab .middleColumn {
  grid-column-start: 4;
}

#bridgeTab .rightColumn {
  grid-column-start: 6;
}

.transferGridRow .upperRow {
  grid-row-start: 2;
}

.transferGridRow .middleUpRow {
  grid-row-start: 4;
}

.transferGridRow .middleBottomRow {
  grid-row-start: 6;
}

.transferGridRow .bottomRow {
  grid-row-start: 8;
}

.leftColumn, 
.middleColumn, 
.rightColumn {
  border: 1px solid #000;
  border-radius: 5px;
  height: 400px;
}

.amount-bottom {
  padding: 0 3em;
}
</style>
