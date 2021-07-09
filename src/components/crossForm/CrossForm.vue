<template>
  <Form id="crossForm" name="crossForm">
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
              :value="originNetwork.name"
            />
          </div>
        </div>

        <!-- Column 4 -->
        <div class="youOwn text-center col-sm-2">
          <label class="tokenAddress-label" for="tokenAddress">You own</label>
          <div class="dropdown">
            <button
              id="dropdownMenuButton"
              class="btn dropdown-toggle"
              :class="{ disabled: !sharedState.isConnected }"
              :disabled="!sharedState.isConnected"
              type="button"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <span v-if="selectedToken?.symbol">
                <img :src="selectedToken?.icon" class="token-logo" />
              </span>
              {{ selectedToken?.symbol ? selectedToken.symbol : 'Select a token' }}
            </button>
            <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
              <li v-for="token in currentNetworkTokens" :key="token.token">
                <a class="dropdown-item" href="#" @click="selectToken(token, $event)">
                  <span><img :src="token.icon" class="token-logo"/></span>
                  {{ token.symbol }}
                </a>
              </li>
            </div>
          </div>
        </div>

        <!-- Column 6 -->
        <div class="amountToCross text-center col-sm-2">
          <label class="amount-label" for="amount">
            <a id="max" class="max" @click="setMaxAmount">
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
              name="senderAddress"
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
              :value="destinationNetwork.name"
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
              >
                <span v-if="willReceiveToken?.icon">
                  <img :src="willReceiveToken?.icon" class="token-logo" />
                </span>
                {{ willReceiveToken?.symbol || '-' }}
              </span>
            </div>
          </div>
        </div>

        <!-- Column 6 -->
        <div class="convertedAmount text-center col-sm-2">
          <label class="amount-label" for="amount">Amount</label>
          <div class="form-group amount">
            <input
              id="receive-amount"
              name="receiveAmount"
              class="form-control-plaintext text-center align-center"
              :class="{ disabled: !sharedState.isConnected }"
              :value="receiveAmount"
              readonly
            />
            <div class="">Service fee {{ fee * 100 + '%' }}</div>
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
              name="receiveAddress"
              class="outline form-control text-center"
              :class="{ disabled: !sharedState.isConnected }"
              placeholder="0x00...af"
              :disabled="!sharedState.isConnected"
              required
            />
            <div class="invalid-feedback-container">
              <ErrorMessage class="invalid-feedback" name="field" />
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
  </Form>
</template>
<script>
import { Field, Form, ErrorMessage } from 'vee-validate'
import { object, string, number } from 'yup'
import BigNumber from 'bignumber.js'

import ALLOW_TOKENS_ABI from '@/constants/abis/allowTokens.json'
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
    Form,
    Field,
    ErrorMessage,
  },
  props: {
    typesLimits: {
      type: Array,
      required: true,
    },
    rskFee: {
      type: Number,
      required: true,
    },
    ethFee: {
      type: Number,
      required: true,
    },
  },
  setup() {
    // const data = this
    // function onSubmit(values) {
    //   alert(JSON.stringify(values, null, 2))
    // }
    // // Using yup to generate a validation schema
    // // https://vee-validate.logaretm.com/v4/guide/validation#validation-schemas-with-yup
    // const schema = object().shape({
    //   receiveAddress: string()
    //     .matches(/^(0x)?[0-9a-fA-F]{40}$/, 'Invalid address')
    //     .required(),
    //   amount: number()
    //     .min(0)
    //     .max(data.selectedToken?.typeId)
    //     .required(),
    // })
    // return {
    //   onSubmit,
    //   schema,
    // }
  },
  data() {
    return {
      sharedState: store.state,
      receiverAddress: '',
      amount: '',
      selectedToken: {},
      maxAmount: 0,
    }
  },
  computed: {
    fee() {
      if (!this.sharedState.currentConfig) return this.rskFee
      return this.sharedState.currentConfig.isRsk ? this.rskFee : this.ethFee
    },
    currentNetworkTokens() {
      const result = []
      for (const token of this.sharedState.tokens) {
        if (token[this.originNetwork.networkId]) {
          result.push({
            token: token.token,
            name: token.name,
            typeId: token.typeId,
            icon: token.icon,
            symbol: token[this.originNetwork.networkId].symbol,
            address: token[this.originNetwork.networkId].address,
            decimals: token[this.originNetwork.networkId].decimals,
            receiveToken: {
              icon: token.icon,
              ...token[this.destinationNetwork.networkId],
            },
          })
        }
      }
      return result
    },
    senderAddress() {
      return this.sharedState.accountAddress || '0x00...00'
    },
    originNetwork() {
      return this.sharedState.currentConfig || this.sharedState.rskConfig
    },
    destinationNetwork() {
      return this.sharedState.currentConfig?.crossToNetwork || this.sharedState.ethConfig
    },
    willReceiveToken() {
      return this.selectedToken?.receiveToken
    },
    receiveAmount() {
      return this.amount - this.amount * this.fee
    },
  },
  methods: {
    selectToken: async function(token, event) {
      if (event) event.preventDefault()
      this.selectedToken = token
      const web3 = this.sharedState.web3
      const config = this.sharedState.currentConfig
      if (!token || !web3 || !config) {
        return
      }
      const tokenAddress = token.address
      const tokenContract = new web3.eth.Contract(ERC20_ABI, tokenAddress)

      const decimals = token.decimals
      const balance = await tokenContract.methods.balanceOf(this.sharedState.accountAddress).call()

      const balanceBNs = new BigNumber(balance).shiftedBy(-decimals)
      const allowTokensContract = new web3.eth.Contract(ALLOW_TOKENS_ABI, config.allowTokens)
      const maxWithdrawInWei = await allowTokensContract.methods
        .calcMaxWithdraw(tokenAddress)
        .call()
      const maxWithdraw = new BigNumber(maxWithdrawInWei).shiftedBy(-18)
      this.maxAmount = balanceBNs
      if (balanceBNs.isGreaterThan(maxWithdraw)) {
        this.maxAmount = maxWithdraw
      }
    },
    setMaxAmount: async function(event) {
      if (event) event.preventDefault()
      if (!this.maxAmount) return
      this.amount = this.maxAmount.toFixed(this.selectedToken.decimals, BigNumber.ROUND_DOWN)
    },
    useSameAddress: function(event) {
      if (event) event.preventDefault()
      this.receiverAddress = this.sharedState.accountAddress
    },
    isRequired(value) {
      if (!value) {
        return 'this field is required'
      }
      return true
    },
    isAddress(value) {
      if (!/^(0x)?[0-9a-fA-F]{40}$/i.test(value)) {
        return 'invalid address'
      }
      return true
    },
  },
}
</script>
