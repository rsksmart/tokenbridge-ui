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
      <p v-if="errorMessage" class="text-danger">{{ errorMessage }}</p>
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
import moment from 'moment'
import BRIDGE_ABI from '@/constants/abis/bridge.json'

export default {
  name: 'ClaimWRBTCModal',
  props: {
    transaction: {
      type: Object,
      required: true,
    },
  },
  emits: ['onCloseClaimModal'],
  data() {
    return {
      sharedState: store.state,
      claimType: CLAIM_TYPES.STANDARD,
      receiveAmount: '',
      receiveAmountToken: '',
      amount: '',
      amountToken: '',
      errorMessage: '',
      responseEstimatedGas: {},
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
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ amount: amount, unitType: 'wei' }),
        })
        return response.json()
      } catch (requestError) {
        this.errorMessage = requestError.message
      }
    },
    async handleChangeClaimType($event) {
      switch ($event.target.value) {
        case this.claimTypes.STANDARD: {
          this.amount = this.transaction.receiveAmount
          this.receiveAmount = this.transaction.receiveAmount
          break
        }
        case this.claimTypes.CONVERT_TO_RBTC: {
          const weiAmount = new BigNumber(this.receiveAmount).shiftedBy(-8).toString()
          this.responseEstimatedGas = await this.getEstimatedGasPrice(weiAmount)
          const estimatedGas = new BigNumber(this.responseEstimatedGas?.amountEstimatedGas)
            .shiftedBy(-8)
            .toString()
          this.receiveAmount = new BigNumber(this.amount).minus(estimatedGas).toString()
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
    getDataTypeObject(nonce) {
      return {
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
          relayer: this.sharedState.currentConfig.relayer,
          fee: this.transaction.amount,
          nonce: parseInt(nonce, 10) + 1,
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
    },
    getSignedData(params) {
      return new Promise((resolve, reject) => {
        this.sharedState.web3.currentProvider.sendAsync(
          {
            method: 'eth_signTypedData_v4',
            params,
            from: this.sharedState.accountAddress,
          },
          (error, result) => {
            if (error) {
              reject(error)
            }
            if (result?.error) {
              reject('result Error', result?.error)
            }
            if (!result?.result) {
              reject(new Error('Empty o undefined result'))
            }
            const signature = result.result.substring(2)
            const r = `0x${signature.substring(0, 64)}`
            const s = `0x${signature.substring(64, 128)}`
            const v = parseInt(signature.substring(128, 130), 16)

            resolve({ r, s, v })
          },
        )
      })
    },
    async signWithMetamask() {
      const contract = new this.sharedState.web3.eth.Contract(
        BRIDGE_ABI,
        this.sharedState.currentConfig.bridge,
      )
      try {
        const nonce = await contract.methods.nonces(this.sharedState.accountAddress).call()
        const msgObject = this.getDataTypeObject(nonce)
        const params = [this.sharedState.accountAddress, JSON.stringify(msgObject)]
        const signedData = await this.getSignedData(params)
        return { ...signedData, nonce }
      } catch (error) {
        this.errorMessage = error.message
      }
    },
    async callStandardType() {
      await this.$attrs.on.onCloseClaimModal(CLAIM_TYPES.STANDARD)
    },
    async callSwapToRBTC() {
      try {
        const signedData = await this.signWithMetamask()
        if (!signedData) {
          return null
        }
        const response = await fetch(`${process.env.VUE_APP_RELAYER_API}/swap`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            claimData: {
              toAddress: this.transaction.receiverAddress,
              amount: this.transaction.amount,
              blockHash: this.transaction.blockHash,
              transactionHash: this.transaction.transactionHash,
              logIndex: parseInt(signedData.nonce, 10) + 1,
              originChainId: this.transaction.networkId,
            },
            deadline: moment()
              .add(3, 'days')
              .unix(),
            relayerAddress: this.sharedState.currentConfig.relayer, // env or network setting
            v: signedData.v,
            r: signedData.r,
            s: signedData.s,
            estimatedGasFee: this.responseEstimatedGas,
          }),
        })
        const responseObject = await response.json()
        await this.$attrs.on.onCloseClaimModal(CLAIM_TYPES.CONVERT_TO_RBTC, responseObject)
        this.$parent.handleCloseModal()
      } catch (responseError) {
        this.errorMessage = responseError.message
      }
    },
    async handleClaimAction() {
      this.errorMessage = ''
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
      this.$parent.handleCloseModal();
    },
  },
}
</script>

<style scoped>
.claim-wrbtc-modal .btn {
  min-width: 120px;
}
</style>
