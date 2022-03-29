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
          <!-- TODO: Enable only when the swap is allowed for other tokens  -->
          <!-- <div class="form-check form-check-inline">
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
          </div> -->
          <div v-if="toNetwork.isRsk" class="form-check form-check-inline">
            <input
              id="claim-convert-rbtc"
              v-model="claimType"
              class="form-check-input"
              type="radio"
              name="claimType"
              :value="claimTypes.CONVERT_TO_RBTC"
              :disabled="transaction.tokenFrom !== 'WBTC'"
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
      <p v-if="errorMessage" class="text-danger box-error">{{ errorMessage }}</p>
      <div class="d-flex justify-content-center">
        <button
          class="btn btn-primary mx-4"
          :class="{ disabled: processing }"
          :disabled="processing || requestError || !!errorMessage"
          @click="handleClaimAction"
        >
          OK
        </button>
        <button
          class="btn btn-danger mx-4"
          :class="{ disabled: processing }"
          :disabled="processing"
          @click="handleCancelAction"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { store } from '@/store'
import { CLAIM_TYPES } from '@/constants/claimTypes'
import { findNetworkByChainId } from '@/constants/networks'
import BigNumber from 'bignumber.js'
import moment from 'moment'
import BRIDGE_ABI from '@/constants/abis/bridge.json'
import { decodeCrossEvent } from '../../../utils/decodeEvents'
import globalStore from '@/stores/global.store'

export default {
  name: 'ClaimWRBTCModal',
  components: {},
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
      processing: false,
      deadline: '',
      amountInWei: 0,
      logIndex: '',
      sideTokenBtcContractAddress: '',
      requestError: false,
      swapRbtcProxyAddress: null,
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
    toNetwork() {
      return findNetworkByChainId(this.transaction.destinationChainId, this.transaction.networkId)
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
        if (!response.ok) {
          throw new Error('Error processing your request, please try again')
        }
        return response.json()
      } catch (requestError) {
        this.requestError = true
        this.errorMessage = requestError.message
      }
    },
    async recoverTransactionAmount() {
      const sideToken = this.toNetwork.tokens.filter((x) => x.token == 'WBTC')
      if (sideToken.length === 0) {
        return null // TODO: add an error message
      }
      const receipt = await this.sharedState.sideWeb3.eth.getTransactionReceipt(
        this.transaction.transactionHash,
      )

      const { event, decodedEvent } = decodeCrossEvent(
        this.sharedState.sideWeb3,
        receipt,
        globalStore.state.currentTokenType,
      )

      this.sideTokenBtcContractAddress = sideToken[0].address
      this.logIndex = event.logIndex
      this.amountInWei = decodedEvent._amount
    },
    async handleChangeClaimType($event) {
      this.requestError = false
      this.errorMessage = ''
      switch ($event.target.value) {
        case this.claimTypes.STANDARD: {
          this.amount = this.transaction.receiveAmount
          this.receiveAmount = this.transaction.receiveAmount
          break
        }
        case this.claimTypes.CONVERT_TO_RBTC: {
          this.processing = true;
          
          const wBtcDest = this.toNetwork.tokens.find(x => x.token === 'WBTC');
          if (!wBtcDest) {
            throw new Error('Unable to get decimals');
          }

          
          const weiDecimals = 18 - wBtcDest.decimals;

          await this.recoverTransactionAmount()
          this.responseEstimatedGas = await this.getEstimatedGasPrice(this.amountInWei)

          if (!this.responseEstimatedGas) {
            this.errorMessage = "Couldn't estimate gas fee for swap, please try again soon!"
            return
          }

          const estimatedGas = new BigNumber(this.responseEstimatedGas?.amount)
            .shiftedBy(-1 * wBtcDest.decimals)
            .toString()

          const swap_balance_proxy_v1 = await this.sharedState.web3.eth.getBalance(
            this.sharedState.currentConfig.swapRbtcProxy,
          )

          this.sharedState.web3.eth.getGasPrice().then((gasPrice) => {
            const costInWei = new BigNumber(estimatedGas)
              .multipliedBy(gasPrice)
              .shiftedBy(-1 * weiDecimals)
              .toPrecision(8).toString()

            this.receiveAmount = new BigNumber(this.amount).minus(costInWei).toString()

            if (this.receiveAmount > swap_balance_proxy_v1) {
              this.errorMessage = "The Swap contract doesn't have enough balance."
            }
          })
          this.processing = false
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
          name: 'RSK Token Bridge',
          version: '1',
          chainId: this.transaction.destinationChainId,
          verifyingContract: this.sharedState.currentConfig.bridge,
        },
        message: {
          to: this.transaction.receiverAddress,
          amount: this.amountInWei,
          transactionHash: this.transaction.transactionHash,
          originChainId: this.transaction.networkId,
          relayer: this.sharedState.currentConfig.relayer,
          fee: this.amountInWei,
          nonce: nonce,
          deadline: this.deadline,
        },
        primaryType: 'Claim',
        types: {
          EIP712Domain: [
            { name: 'name', type: 'string' },
            { name: 'version', type: 'string' },
            { name: 'chainId', type: 'uint256' },
            { name: 'verifyingContract', type: 'address' },
          ],
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
 
    async getSignedData(params) {
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
      this.processing = true
      this.deadline = moment().add(3, 'hours').unix().toString()
      this.errorMessage = ''

      try {
        const signedData = await this.signWithMetamask()
        if (!signedData) {
          // TODO: add an error message to display
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
              amount: this.amountInWei,
              blockHash: this.transaction.blockHash,
              transactionHash: this.transaction.transactionHash,
              logIndex: this.logIndex,
              originChainId: this.transaction.networkId,
              destinationChainId: this.transaction.destinationChainId,
            },
            deadline: this.deadline,
            relayerAddress: this.sharedState.currentConfig.relayer,
            v: signedData.v,
            r: signedData.r,
            s: signedData.s,
            estimatedGasFee: this.responseEstimatedGas,
            sideTokenBtcContractAddress: this.sideTokenBtcContractAddress,
          }),
        })
        const responseObject = await response.json()
        console.log(responseObject)
        await this.$attrs.on.onCloseClaimModal(CLAIM_TYPES.CONVERT_TO_RBTC, responseObject)
        this.$parent.handleCloseModal()
      } catch (responseError) {
        this.errorMessage = responseError.message
      }
    },
    async handleClaimAction() {
      try {
        this.processing = true
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
        this.$parent.handleCloseModal()
      } catch (err) {
        console.log(err)
      }
    },
  },
}
</script>

<style scoped>
.claim-wrbtc-modal .btn {
  min-width: 120px;
}
.box-error {
  text-align: center;
}
</style>
