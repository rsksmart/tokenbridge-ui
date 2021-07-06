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
              :class="{ disabled: !sharedState.isConnected }"
              readonly
              :value="originNetwork"
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
              :disabled="!sharedState.isConnected"
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
          <label class="amount-label" for="amount">
            <a id="max" class="max" @click="maxAmount">
              Max
            </a>
          </label>
          <div class="form-group amount">
            <input
              id="amount"
              v-model="amount"
              name="amount"
              class="outline form-control text-center"
              :class="{ disabled: !sharedState.isConnected }"
              placeholder="Amount"
              :disabled="!sharedState.isConnected"
              required
            />
            <div class="invalid-feedback-container">
              <div class="invalid-feedback"></div>
            </div>
          </div>
        </div>

        <!-- Column 8 -->
        <div class="senderAddress text-center  col-sm-5">
          <label class="sender-label" for="sender-address">Sender address</label>
          <div class="form-group">
            <input
              id="sender-address"
              type="text"
              name="sender-address"
              class="form-control-plaintext text-center"
              :class="{ disabled: !sharedState.isConnected }"
              readonly
              :value="senderAddress"
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
              :class="{ disabled: !sharedState.isConnected }"
              readonly
              :value="destinationNetwork"
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
                :class="{ disabled: !sharedState.isConnected }"
                name="willReceiveToken"
                >{{ willReceiveToken }}</span
              >
            </div>
          </div>
        </div>

        <!-- Column 6 -->
        <div class="convertedAmount text-center col-sm-2">
          <label class="amount-label" for="amount">Amount</label>
          <div class="form-group amount">
            <input
              id="receive-amount"
              name="receive-amount"
              class="form-control-plaintext text-center align-center"
              :class="{ disabled: !sharedState.isConnected }"
              :value="receiveAmount"
              readonly
            />
          </div>
        </div>

        <!-- Column 8 -->
        <div class="receiverAddress text-center col-sm-5">
          <label class="receive-label-address" for="receive-address">
            <a id="same-address" class="same-address" @click="useSameAddress">
              Receiver address
            </a>
          </label>
          <div class="form-group receive-address">
            <input
              id="receive-address"
              v-model="receiverAddress"
              type="text"
              name="receive-address"
              class="outline form-control text-center"
              :class="{ disabled: !sharedState.isConnected }"
              placeholder="0x00...af"
              :disabled="!sharedState.isConnected"
              required
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
import BigNumber from 'bignumber.js'

import ALLOW_TOKENS_ABI from '@/constants/abis/allowTokens.json'
import BRIDGE_ABI from '@/constants/abis/bridge.json'
import ERC20_ABI from '@/constants/abis/erc20.json'

import WaitSpinner from './messages/WaitSpinner.vue'
import SuccessMsg from './messages/SuccessMsg.vue'
import ErrorMsg from './messages/ErrorMsg.vue'
import { store } from '@/store.js'

export default {
  name: 'CrossForm',
  components: {
    WaitSpinner,
    SuccessMsg,
    ErrorMsg,
  },
  props: {
    typesLimits: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      sharedState: store.state,
      receiverAddress: '',
      amount: '0',
      selectedToken: '',
      fees: 0,
    }
  },
  computed: {
    senderAddress() {
      return this.sharedState.accountAddress || '0x00...00'
    },
    originNetwork() {
      return this.sharedState.currentConfig?.name || this.sharedState.rskConfig.name
    },
    destinationNetwork() {
      return this.sharedState.currentConfig?.crossToNetwork?.name || this.sharedState.ethConfig.name
    },
    tokenToCross() {
      return this.sharedState.tokens.find(x => x.token == this.selectedToken)
    },
    willReceiveToken() {
      if (!this.sharedState.isConnected || !this.selectedToken) return '-'
      return this.tokenToCross[this.sharedState.currentConfig.crossToNetwork.networkId].symbol
    },
    receiveAmount() {
      return this.amount - this.amount * 0.002
    },
  },
  methods: {
    maxAmount: async function(event) {
      if (event) event.preventDefault()
      let token = this.tokenToCross
      if (!token) {
        return
      }
      const web3 = this.sharedState.web3
      const config = this.sharedState.currentConfig
      const tokenAddress = token[config.networkId].address
      const tokenContract = new web3.eth.Contract(ERC20_ABI, tokenAddress)

      const decimals = token[config.networkId].decimals
      const balance = await tokenContract.methods.balanceOf(this.sharedState.accountAddress).call()

      const balanceBNs = new BigNumber(balance).shiftedBy(-decimals)
      const allowTokensContract = new web3.eth.Contract(ALLOW_TOKENS_ABI, config.allowTokens)
      const maxWithdrawInWei = await allowTokensContract.methods
        .calcMaxWithdraw(tokenAddress)
        .call()
      const maxWithdraw = new BigNumber(maxWithdrawInWei).shiftedBy(-18)
      let maxValue = balanceBNs
      if (balanceBNs.isGreaterThan(maxWithdraw)) {
        maxValue = maxWithdraw
      }
      const bridgeContract = new web3.eth.Contract(BRIDGE_ABI, config.bridge)
      const fee = await bridgeContract.methods.getFeePercentage().call()
      const serviceFee = new BigNumber(maxValue).times(fee).div(config.feePercentageDivider)
      this.amount = maxValue.minus(serviceFee).toFixed(decimals, BigNumber.ROUND_DOWN)
    },
    useSameAddress: function(event) {
      if (event) event.preventDefault()
      this.receiverAddress = this.sharedState.accountAddress
    },
  },
}
</script>
