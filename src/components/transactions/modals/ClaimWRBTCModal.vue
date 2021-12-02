<template>
  <div class="bg-white p-2 rounded-sm claim-wrbtc-modal">
    <div class="modal-header">
      <h4 class="m-0">Claim</h4>
    </div>
    <div class="modal-body">
      <div class="form-group row">
        <div class="col-sm-2 d-flex align-items-center">Receiver</div>
        <div class="col-sm-10">
          <input
            id="receiver"
            type="text"
            readonly
            class="form-control-plaintext"
            :value="transaction.receiverAddress"
          />
        </div>
      </div>
      <div class="form-group row">
        <div class="col-sm-2 d-flex align-items-center">Claim type</div>
        <div class="col-sm-10">
          <div class="form-check form-check-inline">
            <input
              id="claim-standard"
              v-model="claimType"
              class="form-check-input"
              type="radio"
              name="claimType"
              :value="claimTypes.STANDARD"
              @change="handleChangeClaimType($event)"
            />
            <label class="form-check-label" for="claim-standard">Standard</label>
          </div>
          <div class="form-check form-check-inline">
            <input
              id="claim-pay-with-tokens"
              v-model="claimType"
              class="form-check-input"
              type="radio"
              name="claimType"
              :value="claimTypes.PAY_WITH_TOKENS"
              disabled
              @change="handleChangeClaimType($event)"
            />
            <label class="form-check-label" for="claim-pay-with-tokens">Pay gas with tokens</label>
          </div>
          <div class="form-check form-check-inline">
            <input
              id="claim-convert-rbtc"
              v-model="claimType"
              class="form-check-input"
              type="radio"
              name="claimType"
              :value="claimTypes.CONVERT_TO_RBTC"
              @change="handleChangeClaimType($event)"
            />
            <label class="form-check-label" for="claim-convert-rbtc">Convert to RBTC</label>
          </div>
        </div>
      </div>
      <div class="form-group row">
        <div class="col-sm-2 d-flex align-items-center">Amount</div>
        <div class="col-sm-10">
          <input
            id="amount"
            type="text"
            readonly
            class="form-control-plaintext"
            :value="amountValue"
          />
        </div>
      </div>
      <div class="form-group row">
        <div class="col-sm-2 d-flex align-items-center">Will receive</div>
        <div class="col-sm-10">
          <input
            id="receiveAmount"
            type="text"
            readonly
            class="form-control-plaintext"
            :value="receiveAmountValue"
          />
        </div>
      </div>
      <div class="d-flex justify-content-center">
        <button class="btn btn-primary mx-4" @click="handleClaimAction">OK</button>
        <button class="btn btn-danger mx-4" @click="handleCancelAction">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script>
import { store } from '@/store'
import { CLAIM_TYPES } from '@/constants/claimTypes'
import BigNumber from 'bignumber.js'
import moment from "moment";

export default {
  name: 'ClaimWRBTCModal',
  props: {
    transaction: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      sharedState: store.state,
      claimType: CLAIM_TYPES.STANDARD,
      receiveAmount: '',
      receiveAmountToken: '',
      amount: '',
      amountToken: '',
    }
  },
  computed: {
    amountValue() {
      return `${this.amount} ${this.amountToken}`
    },
    receiveAmountValue() {
      return `${this.receiveAmount} ${this.receiveAmountToken}`
    },
    claimTypes() {
      return CLAIM_TYPES
    },
  },
  mounted() {
    this.handleChangeClaimType({ target: { value: this.claimTypes.STANDARD } })
  },
  methods: {
    async getEstimatedGasPrice(amount) {
      try {
        const response = await fetch(`${process.env.VUE_APP_RELAYER_API}/estimated-gas`, {
          method: 'POST',
          body: JSON.stringify({ amount: amount, unitType: 'wei' }),
        })
        const responseObject = await response.json()

        console.log(responseObject)
        return this.amount
      } catch (requestError) {
        console.error(requestError)
      }
    },
    async handleChangeClaimType($event) {
      switch ($event.target.value) {
        case this.claimTypes.STANDARD: {
          this.amount = new BigNumber(this.transaction.amount).shiftedBy(-18)
          this.receiveAmount = this.transaction.receiveAmount
          break
        }
        case this.claimTypes.CONVERT_TO_RBTC: {
          const estimatedGasPrice = await this.getEstimatedGasPrice(this.amount)
          console.log(estimatedGasPrice)
          //this.estimatedAmount = estimatedGasPrice
          break
        }
        default: {
          break
        }
      }
    },
    handleCancelAction() {
      this.$parent.handleCloseModal()
    },
    async signWithMetamask(payload, callback) {
      const msgObject = {
        domain: {
          chainId: this.transaction.destinationChainId,
          name: 'RSK Token Bridge',
          verifyingContract: this.sharedState.currentConfig.bridge.toLowerCase(),
          version: '1',
        },
        message: {
          to: this.transaction.receiverAddress,
          amount: this.transaction.amount,
          transactionHash: this.transaction.transactionHash,
          originChainId: this.transaction.networkId,
          relayer: '0x3cbec7a3ffed4153cb3610a08057264d87d7018b',
          fee: this.transaction.amount,
          nonce: '0',
          deadline: moment()
            .add(3, 'days')
            .unix(),
        },
        primaryType: 'Claim',
        types: {
          Claim: [
            { name: 'to', type: 'address' },
            { name: 'amount', type: 'uint256' },
            { name: 'transactionHash', type: 'bytes32' },
            { name: 'originChainId', type: 'uint256' },
            { name: 'relayer', type: 'address' },
            { name: 'fee', type: 'uint256' },
            { name: 'nonce', type: 'uint256' },
            { name: 'deadline', type: 'uint256' },
          ],
        },
      }
      const params = [this.sharedState.accountAddress, JSON.stringify(msgObject)]

      this.sharedState.rskWeb3.currentProvider.send(
        {
          jsonrpc: '2.0',
          method: 'eth_signTypedData_v4',
          id: 0,
          params,
        },
        (error, result) => {
          if (error) {
            console.dir(error)
          }
          if (result?.error) {
            console.error('result Error', result?.error)
          }
          console.log('Result.result', JSON.stringify(result?.result))

          console.log('Result', result)
        },
      )
    },
    async callStandardType() {
      // Call standard Type
    },
    async callSwapToRBTC() {
      try {
        const signedData = await this.signWithMetamask()
        console.log('Signed Data', signedData)
        if (!signedData) {
          return null
        }
        const response = await fetch(`${process.env.VUE_APP_RELAYER_API}/swap`, {
          method: 'POST',
          body: JSON.stringify({
            claimData: {
              toAddress: this.transaction.receiverAddress,
              amount: this.transaction.amount,
              blockHash: this.transaction.blockHash,
              transactionHash: this.transaction.transactionHash,
              logIndex: '', // event index
              originChainId: this.transaction.networkId, // number or hex
            },
            deadline: '', // ?
            relayerAddress: '', // env or network setting
            v: signedData.v,
            r: signedData.r,
            s: signedData.s,
            estimatedGasFee: {
              amount: '',
              unitType: '',
            },
          }),
        })
        const responseObject = await response.json()

        this.$parent.handleCloseModal()
      } catch (responseError) {
        console.error(responseError)
      }
    },
    async handleClaimAction() {
      switch (this.claimType) {
        case CLAIM_TYPES.STANDARD:
          await this.callStandardType()
          break
        case CLAIM_TYPES.CONVERT_TO_RBTC:
          await this.callSwapToRBTC()
          break
        case CLAIM_TYPES.PAY_WITH_TOKENS:
          await this.callStandardType()
          break
        default:
          break
      }
    },
  },
}
</script>

<style scoped>
.claim-wrbtc-modal .btn {
  min-width: 120px;
}
</style>
