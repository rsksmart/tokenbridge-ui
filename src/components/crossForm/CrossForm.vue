<template>
  <Form id="crossForm" name="crossForm" @submit="onSubmit">
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
              id="tokenAddress"
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
          <div class="invalid-feedback-container">
            <div class="invalid-feedback" name="tokenAddress">
              {{ selectedTokenError }}
            </div>
          </div>
        </div>

        <!-- Column 6 -->
        <div class="amountToCross text-center col-sm-3">
          <label class="amount-label" for="amount">
            <a id="max" class="max" @click="setMaxAmount">
              Max
            </a>
          </label>
          <div class="form-group amount">
            <Field
              id="amount"
              v-model="amount"
              name="amount"
              class="outline form-control text-center"
              :class="{ disabled: !sharedState.isConnected }"
              placeholder="Amount"
              :disabled="!sharedState.isConnected"
              :rules="validateAmount"
              required
            />
            <div class="invalid-feedback-container">
              <ErrorMessage class="invalid-feedback" name="amount" />
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
        <div class="convertedAmount text-center col-sm-3">
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
          <label class="receive-label-address" for="receiveAddress">
            <a id="same-address" class="same-address" @click="useSameAddress">
              Receiver address
            </a>
          </label>
          <div class="form-group receive-address">
            <Field
              id="receiveAddress"
              v-model="receiverAddress"
              type="text"
              name="receiveAddress"
              class="outline form-control text-center"
              :class="{ disabled: !sharedState.isConnected }"
              placeholder="0x00...af"
              :disabled="!sharedState.isConnected"
              :rules="validateAddress"
              required
            />
            <div class="invalid-feedback-container">
              <ErrorMessage class="invalid-feedback" name="receiveAddress" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row justify-content-center">
      <button
        v-if="!hasAllowance"
        id="approve"
        class="btn btn-primary mr-3 mb-3"
        :disabled="!sharedState.isConnected"
        @click="approveClick"
      >
        Approve
      </button>
      <button
        id="deposit"
        type="submit"
        class="btn btn-primary ml-3 mb-3"
        :disabled="!sharedState.isConnected || !hasAllowance"
      >
        Convert tokens
      </button>
    </div>

    <WaitSpinner :show="showSpinner" />
    <SuccessMsg :show="showSuccess" />
    <ErrorMsg :error="error" />
  </Form>
</template>
<script>
import { Field, Form, ErrorMessage } from 'vee-validate'
import BigNumber from 'bignumber.js'

// import ALLOW_TOKENS_ABI from '@/constants/abis/allowTokens.json'
import ERC20_ABI from '@/constants/abis/erc20.json'
import { MAX_UINT256, waitForReceipt } from '@/utils'

import WaitSpinner from './WaitSpinner.vue'
import SuccessMsg from './SuccessMsg.vue'
import ErrorMsg from './ErrorMsg.vue'
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
  data() {
    return {
      sharedState: store.state,
      receiverAddress: '',
      amount: '',
      selectedToken: {},
      selectedTokenError: '',
      selectedTokenBalance: 0,
      selectedTokenMaxLimit: 0,
      selectedTokenMinLimit: 0,
      selectedTokenMediumAmount: 0,
      selectedTokenLargeAmount: 0,
      hasAllowance: false,
      showSpinner: false,
      error: '',
      showSuccess: false,
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
    onSubmit(values) {
      alert(JSON.stringify(values, null, 2))
    },
    async selectToken(token, event) {
      if (event) event.preventDefault()
      this.selectedToken = token
      this.selectedTokenError = ''
      const web3 = this.sharedState.web3
      const config = this.sharedState.currentConfig
      if (!token || !web3 || !config) {
        return
      }
      const tokenAddress = token.address
      const tokenContract = new web3.eth.Contract(ERC20_ABI, tokenAddress)

      const decimals = token.decimals
      const balance = await tokenContract.methods.balanceOf(this.sharedState.accountAddress).call()

      this.selectedTokenBalance = new BigNumber(balance).shiftedBy(-decimals)
      // // The correct form is use calcMaxWithdraw to check the limit
      // // we use the max limit as it is more performant and theres a 99.9% that this is the max limit
      // const allowTokensContract = new web3.eth.Contract(ALLOW_TOKENS_ABI, config.allowTokens)
      // const maxWithdrawInWei = await allowTokensContract.methods
      //   .calcMaxWithdraw(tokenAddress)
      //   .call()
      const limits = this.typesLimits[this.selectedToken.typeId]
      this.selectedTokenMaxLimit = new BigNumber(limits.max).shiftedBy(-18)
      this.selectedTokenMinLimit = new BigNumber(limits.min).shiftedBy(-18)
      this.selectedTokenMediumAmount = new BigNumber(limits.mediumAmount).shiftedBy(-18)
      this.selectedTokenLargeAmount = new BigNumber(limits.largeAmount).shiftedBy(-18)
      this.validateAmount(this.amount)
      const allowance = await tokenContract.methods
        .allowance(this.sharedState.accountAddress, config.bridge)
        .call()
      this.hasAllowance = new BigNumber(allowance).shiftedBy(-18).lte(this.selectedTokenMaxLimit)
    },
    async setMaxAmount(event) {
      if (event) event.preventDefault()
      if (!this.selectedTokenMaxLimit || !this.selectedTokenBalance) return
      let maxAmount = this.selectedTokenBalance
      if (this.selectedTokenBalance.isGreaterThan(this.selectedTokenMaxLimit)) {
        maxAmount = this.selectedTokenMaxLimit
      }
      this.amount = maxAmount.toFixed(this.selectedToken.decimals, BigNumber.ROUND_DOWN)
    },
    useSameAddress(event) {
      if (event) event.preventDefault()
      this.receiverAddress = this.sharedState.accountAddress
    },
    async getGasPriceHex() {
      const web3 = this.sharedState.web3
      const config = this.sharedState.currentConfig
      var gasPriceParsed = 0
      if (config.networkId >= 30 && config.networkId <= 33) {
        const block = await web3.eth.getBlock('latest')
        gasPriceParsed = parseInt(block.minimumGasPrice)
        gasPriceParsed = gasPriceParsed <= 1 ? 1 : gasPriceParsed * 1.03
      } else {
        const gasPriceAvg = await web3.eth.getGasPrice()
        gasPriceParsed = parseInt(gasPriceAvg)
        gasPriceParsed = gasPriceParsed <= 1 ? 1 : gasPriceParsed * 1.3
      }
      return `0x${Math.ceil(gasPriceParsed).toString(16)}`
    },
    async approveClick(event) {
      event.preventDefault()
      if (!this.selectedToken?.address) {
        this.selectedTokenError = 'Choose a token to approve'
        return
      }
      const data = this
      const web3 = data.sharedState.web3
      const config = data.sharedState.currentConfig
      if (!web3 || !config) {
        // should be disabled
        return
      }
      const accountAddress = data.sharedState.accountAddress
      const tokenAddress = data.selectedToken.address
      const tokenContract = new web3.eth.Contract(ERC20_ABI, tokenAddress)

      let gasPrice = await data.getGasPriceHex()
      data.showSpinner = true

      return new Promise((resolve, reject) => {
        tokenContract.methods
          .approve(config.bridge, MAX_UINT256)
          .send({ from: accountAddress, gasPrice: gasPrice, gas: 70_000 }, async (err, txHash) => {
            const regExp = new RegExp(/^0x[0-9A-Fa-f]+$/i)
            const sanitizedTxHash = regExp.test(txHash) ? txHash : ''
            const txExplorerLink = txHash
              ? `<a target="_blank" href="${config.explorer}/tx/${sanitizedTxHash}">see Tx</a>`
              : ''
            if (err) {
              reject(new Error(`Execution failed ${err.message} ${txExplorerLink}`))
            }
            try {
              let receipt = await waitForReceipt(txHash, web3)
              if (receipt.status) {
                resolve(receipt)
              }
            } catch (err) {
              reject(new Error(`${err} ${txExplorerLink}`))
            }
          })
      })
        .then(() => {
          data.hasAllowance = true
          data.showSpinner = false
        })
        .catch(err => {
          data.hasAllowance = false
          data.showSpinner = false
          console.error(err)
          data.error = `Couldn't approve. ${err.message}`
        })
    },
    validateAmount(value) {
      if (!value) {
        return 'amount is required'
      }
      const amount = new BigNumber(value)
      if (!this.selectedToken?.symbol) return true

      if (amount.isLessThan(this.selectedTokenMinLimit)) {
        return `min amount is ${this.selectedTokenMinLimit}`
      }
      if (amount.isGreaterThan(this.selectedTokenBalance)) {
        return `amount bigger than your balance`
      }
      if (amount.isGreaterThan(this.selectedTokenMaxAmount)) {
        return `max amount is ${this.selectedTokenMaxAmount}`
      }
      return true
    },
    validateAddress(value) {
      if (!value) return 'destionation address is required'
      if (!/^(0x)?[0-9a-fA-F]{40}$/i.test(value)) {
        return 'invalid address'
      }
      return true
    },
  },
}
</script>
