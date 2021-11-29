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
            :value="transaction.receiver"
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
          <input id="amount" type="text" readonly class="form-control-plaintext" :value="amountValue" />
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
      claimTypes: {
        STANDARD: 'standard',
        PAY_WITH_TOKENS: 'payWithTokens',
        CONVERT_TO_RBTC: 'convertToRBTC',
      },
      claimType: 'standard',
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
  },
  mounted() {
    this.handleChangeClaimType({ target: { value: this.claimTypes.STANDARD } })
  },
  methods: {
    async getEstimatedGasPrice(amount) {
      try {
        const response = await fetch(`${process.env.VUE_APP_RELAYER_API}/estimated-gas`, {
          method: 'POST',
          body: JSON.stringify({ amount: '', unitType: 'wei' }),
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
          this.amount = this.transaction.amount
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
    signWithMetamask() {
      const msgObject = {
        domain: {
          chainId: this.transaction.networkId, // I will need the destination network id
          // Give a user friendly name to the specific contract you are signing for.
          name: 'Ether Mail',
          // If name isn't enough add verifying contract to make sure you are establishing contracts with the proper entity
          verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
          // Just let's you know the latest version. Definitely make sure the field name is correct.
          version: '1',
        },
        // Defining the message signing data content.
        message: {
          /*
           - Anything you want. Just a JSON Blob that encodes the data you want to send
           - No required fields
           - This is DApp Specific
           - Be as explicit as possible when building out the message schema.
          */
          contents: '',
          attachedMoneyInEth: 4.2,
          from: {
            name: '',
            wallets: [this.transaction.senderAddress],
          },
          to: [
            {
              name: '',
              wallets: [this.transaction.receiverAddress],
            },
          ],
        },
        primaryType: 'Mail',
        types: {
          // TODO: Clarify if EIP712Domain refers to the domain the contract is hosted on
          EIP712Domain: [
            { name: 'name', type: 'string' },
            { name: 'version', type: 'string' },
            { name: 'chainId', type: 'uint256' },
            { name: 'verifyingContract', type: 'address' },
          ],
          // Not an EIP712Domain definition
          Group: [
            { name: 'name', type: 'string' },
            { name: 'members', type: 'Person[]' },
          ],
          // Refer to PrimaryType
          Mail: [
            { name: 'from', type: 'Person' },
            { name: 'to', type: 'Person[]' },
            { name: 'contents', type: 'string' },
          ],
          // Not an EIP712Domain definition
          Person: [
            { name: 'name', type: 'string' },
            { name: 'wallets', type: 'address[]' },
          ],
        },
      }
    },
    async handleClaimAction() {
      try {
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
            v: '', // ?
            r: '', // ?
            s: '', // ?
            estimatedGasFee: {
              amount: '',
              unitType: '',
            },
          }),
        })
        const responseObject = await response.json()
        this.signWithMetamask(responseObject)
        this.$parent.handleCloseModal()
      } catch (responseError) {
        console.error(responseError)
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
