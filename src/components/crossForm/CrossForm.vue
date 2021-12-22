<template>
  <Form
    v-if="false"
    id="crossForm"
    ref="crossForm"
    name="crossForm"
    class="cross-form"
    @submit="onSubmit"
  >
    <div id="bridgeTab" class="align-center">
      <div class="firstRow row justify-content-sm-center">
        <!-- Column 2 -->
        <div class="text-center  col-sm-2">
          <label class="tokenAddress-label" for="originNetwork">Origin Network</label>
          <div class="form-group">
            <span class="originNetwork">
              {{ originNetwork?.name }}
            </span>
          </div>
        </div>

        <!-- Column 4 -->
        <div class="youOwn text-center col-sm-2">
          <label class="tokenAddress-label" for="tokenAddress">You own</label>
          <div class="dropdown">
            <button
              id="tokenAddress"
              class="btn dropdown-toggle"
              :class="{ disabled: disabled }"
              :disabled="disabled"
              type="button"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <span v-if="selectedToken?.symbol">
                <img
                  :src="selectedToken?.icon"
                  class="token-logo"
                  :alt="`${selectedToken?.name} Logo`"
                />
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

        <!-- Column 7 -->
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
              :class="{ disabled: disabled }"
              placeholder="Amount"
              :disabled="disabled"
              :rules="validateAmount"
              required
            />
            <div class="invalid-feedback-container">
              <ErrorMessage class="invalid-feedback" name="amount" />
            </div>
          </div>
        </div>

        <!-- Column 12 -->
        <div class="senderAddress text-center  col-sm-5">
          <label class="sender-label" for="sender-address">Sender address</label>
          <div class="form-group">
            <input
              id="sender-address"
              type="text"
              name="senderAddress"
              class="form-control-plaintext text-center"
              :class="{ disabled: disabled }"
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
            <span class="destinationNetwork">
              {{ destinationNetwork?.name }}
            </span>
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
                :class="{ disabled: disabled }"
                name="willReceiveToken"
              >
                <span v-if="willReceiveToken?.icon">
                  <img :src="willReceiveToken?.icon" class="token-logo" />
                </span>
                {{ willReceiveToken?.symbol || '-' }}
              </span>
            </div>
          </div>
          <div class="confirmation-time">
            Confirmations
            {{ confirmations.blocks ? ` ${confirmations.blocks} blocks` : ' -' }}
            <br />
            {{ confirmations.time ? ` ~ aprox ${confirmations.time}` : '' }}
          </div>
        </div>

        <!-- Column 7 -->
        <div class="convertedAmount text-center col-sm-3">
          <label class="amount-label" for="receive-amount">Amount</label>
          <div class="form-group amount">
            <input
              id="receive-amount"
              name="receiveAmount"
              class="form-control-plaintext text-center align-center"
              :class="{ disabled: disabled }"
              :value="receiveAmount"
              readonly
            />
            <div class="fee">Service fee {{ fee * 100 + '%' }}</div>
          </div>
        </div>

        <!-- Column 12 -->
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
              :class="{ disabled: disabled }"
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
      <div class="row">
        <div class="offset-md-2 col-md-8 col-12">
          <p v-if="destinationNetwork?.isRsk" class="alert alert-warning" role="alert">
            Binance is not taking deposits sent by a smart contract for RSK network, they only
            accept deposits from an account
          </p>
        </div>
      </div>
    </div>
    <div v-if="claimCost" class="row justify-content-center mb-4">
      <div class="col-sm-12 col-md-5 border note-container px-4 py-2 bg-light text-center">
        <strong class="fw-bold d-block">Important!</strong>
        <span>
          You'll need <strong>{{ claimCost }}</strong> to claim the tokens
        </span>
      </div>
    </div>

    <div class="row justify-content-center mb-3">
      <button
        v-if="!hasAllowance"
        id="approved"
        class="btn btn-primary mr-3"
        :disabled="disabled"
        @click="approveClick"
      >
        Approve
      </button>
      <button
        id="deposits"
        type="submit"
        class="btn btn-primary"
        :disabled="disabled || !hasAllowance"
      >
        Cross tokens
      </button>
    </div>
  </Form>

  <div class="row mt-5">
    <div class="col-5">
      <Transfer
        v-model:amount="amount"
        title="Origin"
        :networks="originNetworks"
        transfer-type="origin"
        :disabled="disabled"
        :chain-id="originNetwork?.networkId"
        :max-amount="maxAmount"
        @changeNetwork="handleChangeNetwork"
        @selectToken="selectToken"
      />
    </div>
    <div class="col-2 flex align-self-center text-center">
      <button class="btn btn-link swap-btn" :disabled="disabled" @click="handleSwitchNetwork">
        <i class="fas fa-exchange-alt"></i>
      </button>
    </div>
    <div class="col-5">
      <Transfer
        v-model:amount="receiveAmount"
        v-model:address="receiverAddress"
        title="Destination"
        :networks="destinationNetworks"
        transfer-type="destination"
        :disabled="disabled"
        :chain-id="destinationNetwork?.networkId"
        :token="willReceiveToken"
        @changeNetwork="handleChangeDestinationNetwork"
      >
        <template v-if="!disabled" #footer>
          You'll need <strong>{{ claimCost }}</strong> to claim the tokens
        </template>
      </Transfer>
    </div>
  </div>
  <div class="row justify-content-center mb-3 mt-5">
    <button
      v-if="!hasAllowance"
      id="approve"
      class="btn btn-primary mr-3"
      :disabled="disabled"
      @click="approveClick"
    >
      Approve
    </button>
    <button
      id="deposit"
      class="btn btn-primary"
      :disabled="disabled || !hasAllowance"
      @click="onSubmit"
    >
      Cross tokens
    </button>
  </div>
  <WaitSpinner :show="showSpinner" :wait-seconds="waitSeconds" />

  <SuccessMsg
    :show="showSuccess"
    :confirmations="confirmations"
    :receive-amount="receiveAmount"
    :receive-token="willReceiveToken?.symbol || ''"
  />
  <ErrorMsg :error="error" />

  <Modal v-if="showModal" @close="showModal = false">
    <template #title>
      How to obtain the tokens
    </template>
    <template #body>
      <p>When the transaction is mined you will see it like</p>
      <img src="pending-tx.png" alt="pending transaction" />
      <p>Once it has enough confirmation you will need to <b>claim it on the other network</b></p>
      <img src="claim-tx.png" alt="claim transaction" />
    </template>
  </Modal>
</template>
<script>
import { Field, Form, ErrorMessage } from 'vee-validate'
import BigNumber from 'bignumber.js'
import moment from 'moment'

import ERC20_ABI from '@/constants/abis/erc20.json'
import { sanitizeTxHash, retry3Times } from '@/utils'

import Modal from '@/components/commons/Modal.vue'
import WaitSpinner from './WaitSpinner.vue'
import SuccessMsg from './SuccessMsg.vue'
import ErrorMsg from './ErrorMsg.vue'
import { store } from '@/store.js'
import { ESTIMATED_GAS_AVG } from '@/constants/transactions'
import { METHOD_TYPES } from '@/constants/methodType'
import ERC20TokenTransaction from '@/modules/transactions/transactionsTypes/ERC20TokenTransaction'
import Transfer from '@/components/transfer/Transfer'
import {
  findNetworkByChainId,
  getNetworksConf,
  getNonDuplicateNetworks,
} from '@/constants/networks'
import { numToHex } from '@/utils/helpers'

export default {
  name: 'CrossForm',
  components: {
    Modal,
    WaitSpinner,
    SuccessMsg,
    ErrorMsg,
    Form,
    Field,
    ErrorMessage,
    Transfer,
  },
  inject: ['$services'],
  props: {
    typesLimits: {
      type: Array,
      required: true,
    },
    rskFee: {
      type: Number,
      required: true,
    },
    sideFee: {
      type: Number,
      required: true,
    },
    rskConfirmations: {
      type: Object,
      required: true,
    },
    sideConfirmations: {
      type: Object,
      required: true,
    },
  },
  emits: ['newTransaction'],
  data() {
    return {
      sharedState: store.state,
      receiverAddress: '',
      maxAmount: '',
      amount: 0,
      selectedToken: {},
      selectedTokenError: '',
      selectedTokenBalance: 0,
      selectedTokenMaxLimit: 0,
      selectedTokenMinLimit: 0,
      selectedTokenMediumAmount: 0,
      selectedTokenLargeAmount: 0,
      hasAllowance: false,
      showSpinner: false,
      showSuccess: false,
      showModal: false,
      error: '',
      claimCost: null,
      erc20TokenInstance: null,
      // this is the new values
      originNetworkSelected: null,
      originNetworks: [],
      destinationNetworks: [],
    }
  },
  computed: {
    confirmations() {
      if (
        !this.sharedState.currentConfig ||
        !this.amount ||
        !this.typesLimits?.length ||
        !this.selectedToken?.typeId
      )
        return {}
      const config = this.sharedState.currentConfig
      const confirmations = config.isRsk ? this.rskConfirmations : this.sideConfirmations
      // convert amount to wei to compare against limits
      const amount = new BigNumber(this.amount).shiftedBy(18)
      const limit = this.typesLimits[this.selectedToken?.typeId]
      if (amount.isLessThan(limit.mediumAmount)) {
        return {
          blocks: confirmations.smallAmount,
          time: moment
            .duration(confirmations.smallAmount * config.secondsPerBlock, 'seconds')
            .add(2, 'minutes') // voting time
            .humanize(),
        }
      } else if (amount.isLessThan(limit.largeAmount)) {
        return {
          blocks: confirmations.mediumAmount,
          time: moment
            .duration(confirmations.mediumAmountTime * config.secondsPerBlock, 'seconds')
            .add(2, 'minutes') // voting time
            .humanize(),
        }
      } else {
        return {
          blocks: confirmations.largeAmount,
          time: moment
            .duration(confirmations.largeAmountTime * config.secondsPerBlock, 'seconds')
            .add(2, 'minutes') // voting time
            .humanize(),
        }
      }
    },
    accountConnected() {
      return `${this.sharedState.chainId || ''} ${this.sharedState.accountAddress || ''} ${this
        .sharedState.sideConfig?.networkId || ''}`.trim()
    },
    fee() {
      if (!this.sharedState.currentConfig) return this.rskFee
      return this.sharedState.currentConfig.isRsk ? this.rskFee : this.sideFee
    },
    disabled() {
      return !this.sharedState.isConnected || this.showSpinner
    },
    currentNetworkTokens() {
      return this.originNetwork?.tokens
    },
    senderAddress() {
      return this.sharedState.accountAddress || '0x00...00'
    },
    originNetwork() {
      return this.sharedState.currentConfig || this.sharedState.rskConfig
    },
    destinationNetwork() {
      return this.sharedState.currentConfig?.crossToNetwork || this.sharedState.sideConfig
    },
    willReceiveToken() {
      return this.selectedToken?.receiveToken
    },
    receiveAmount() {
      return this.amount - this.amount * this.fee
    },
    waitSeconds() {
      if (!this.sharedState.currentConfig || !this.selectedTokenMediumAmount || !this.amount) {
        return 0
      }
      return this.sharedState.currentConfig.secondsPerBlock
    },
  },
  watch: {
    amount(value) {
      this.error = ''
      this.showSuccess = false
      this.amount =
        typeof value == 'string' ? value.replace(',', '.').replace(/[^0-9]\./gi, '') : value
    },
    accountConnected(newValue, oldValue) {
      if (this.isMounted && newValue) {
        this.handleOnAccountConnected()
      }
    },
  },
  mounted() {
    if (!this.erc20TokenInstance) {
      this.handleOnAccountConnected()
    }
    this.isMounted = true
  },
  methods: {
    handleChangeNetwork(network) {
      const networksConf = getNetworksConf(network.networkId)
      this.originNetworkSelected = network
      this.destinationNetworks = networksConf?.networks.map(record => record.crossToNetwork)
    },
    handleChangeDestinationNetwork(network) {
      const originNetwork = findNetworkByChainId(
        this.originNetworkSelected.networkId,
        network.networkId,
      )
      const rskConfig = originNetwork.isRsk ? originNetwork : originNetwork.crossToNetwork
      const sideConfig = rskConfig.crossToNetwork
      if (this.originNetworkSelected.crossToNetwork.networkId !== network.networkId) {
        const originNetworkIndex = this.originNetworks.findIndex(
          net => net.networkId === originNetwork.networkId,
        )
        this.originNetworks.splice(originNetworkIndex, 1, originNetwork)
      }

      store.initMainSettings(originNetwork.networkId, rskConfig, sideConfig)
    },
    async handleAddNetwork(networkConfig) {
      try {
        const chainId = numToHex(networkConfig.networkId)
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId,
              chainName: networkConfig.name,
              nativeCurrency: {
                name: networkConfig.mainToken.name,
                symbol: networkConfig.mainToken.symbol,
                decimals: networkConfig.mainToken.decimals,
              },
              rpcUrls: [networkConfig.rpc],
            },
          ],
        })
      } catch (error) {
        console.error(error)
      }
    },
    async handleSwitchNetwork() {
      try {
        const chainId = numToHex(this.sharedState.currentConfig.crossToNetwork.networkId)
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId }],
        })
      } catch (error) {
        if (error.code === 4902) {
          await this.handleAddNetwork(this.sharedState.currentConfig.crossToNetwork)
        }
      }
    },
    handleOnAccountConnected() {
      this.refreshBalanceAndAllowance().then(() => {
        this.setClaimCost()
        this.initData()
        if (this.accountConnected) {
          store.initNetworkSettings()
        }
      })
      // this.resetForm()
    },
    initData() {
      this.erc20TokenInstance = new ERC20TokenTransaction({
        web3: this.sharedState.web3,
        config: this.sharedState.currentConfig,
      })
      this.originNetworks = getNonDuplicateNetworks()
    },
    resetForm() {
      this.selectedToken = {}
      this.amount = ''
      // this.$refs.crossForm.resetForm()
    },
    async refreshBalanceAndAllowance() {
      const web3 = this.sharedState.web3
      const config = this.sharedState.currentConfig
      const token = this.selectedToken
      if (!token?.address || !web3 || !config) {
        return
      }
      const decimals = token.decimals
      if (token.methodType === METHOD_TYPES.DEPOSITOR) {
        const ethBalance = await web3.eth.getBalance(this.sharedState.accountAddress)
        this.selectedTokenBalance = new BigNumber(ethBalance).shiftedBy(-decimals)
        if (new BigNumber(this.amount).isGreaterThan(this.selectedTokenBalance)) {
          this.amount = this.selectedTokenBalance.toFixed(decimals)
        }
        this.hasAllowance = true
      } else {
        const tokenContract = new web3.eth.Contract(ERC20_ABI, token.address)
        const balance = await retry3Times(
          tokenContract.methods.balanceOf(this.sharedState.accountAddress).call,
        )
        this.selectedTokenBalance = new BigNumber(balance).shiftedBy(-decimals)
        if (new BigNumber(this.amount).isGreaterThan(this.selectedTokenBalance)) {
          this.amount = this.selectedTokenBalance.toFixed(decimals)
        }
        const allowance = await retry3Times(
          tokenContract.methods.allowance(this.sharedState.accountAddress, config.bridge).call,
        )
        // as we set the allowance to the highest uint256 it should always be bigger than selectedTokenMaxLimit
        this.hasAllowance = new BigNumber(allowance)
          .shiftedBy(-decimals)
          .gte(this.selectedTokenMaxLimit)
      }
    },
    async selectToken(token, event) {
      this.error = ''
      this.showSuccess = false
      if (event) event.preventDefault()
      this.selectedToken = token
      this.selectedTokenError = ''
      const web3 = this.sharedState.web3
      const config = this.sharedState.currentConfig
      if (!token?.address || !web3 || !config) {
        return
      }

      // // The correct form is use calcMaxWithdraw to check the limit
      // // we use the max limit as it is more performant and theres a 99.9% that this is the max limit
      // const allowTokensContract = new web3.eth.Contract(ALLOW_TOKENS_ABI, config.allowTokens)
      // const maxWithdrawInWei = await allowTokensContract.methods
      //   .calcMaxWithdraw(tokenAddress)
      //   .call()
      const limits = this.sharedState.networkSettings.typesLimits[this.selectedToken.typeId]
      this.selectedTokenMaxLimit = new BigNumber(limits.max).shiftedBy(-token.decimals)
      this.selectedTokenMinLimit = new BigNumber(limits.min).shiftedBy(-token.decimals)
      this.selectedTokenMediumAmount = new BigNumber(limits.mediumAmount).shiftedBy(-token.decimals)
      this.selectedTokenLargeAmount = new BigNumber(limits.largeAmount).shiftedBy(-token.decimals)

      await this.refreshBalanceAndAllowance()
      await this.setMaxAmount(event)
    },
    async setMaxAmount(event) {
      if (event) event.preventDefault()
      if (!this.selectedTokenMaxLimit || !this.selectedTokenBalance) {
        return
      }
      let maxAmount = this.selectedTokenBalance
      if (this.selectedTokenBalance.isGreaterThan(this.selectedTokenMaxLimit)) {
        maxAmount = this.selectedTokenMaxLimit
      }
      this.maxAmount = maxAmount.toFixed(this.selectedToken.decimals, BigNumber.ROUND_DOWN)
    },
    useSameAddress(event) {
      if (event) event.preventDefault()
      this.receiverAddress = this.sharedState.accountAddress
    },
    txExplorerLink(txHash) {
      const sanitizedTxHash = sanitizeTxHash(txHash)
      return txHash
        ? `<a target="_blank" href="${this.sharedState.currentConfig.explorer}/tx/${sanitizedTxHash}">see Tx</a>`
        : ''
    },
    async approveClick(event) {
      this.error = ''
      this.showSuccess = false
      event.preventDefault()
      if (!this.selectedToken?.address) {
        this.selectedTokenError = 'Choose a token to approve'
        return
      }
      const web3 = this.sharedState.web3
      const config = this.sharedState.currentConfig
      if (!web3 || !config) {
        // should be disabled
        return
      }
      const accountAddress = this.sharedState.accountAddress
      const tokenAddress = this.selectedToken.address

      try {
        this.showSpinner = true
        const receipt = await this.erc20TokenInstance.approve(tokenAddress, {
          from: accountAddress,
          gas: 70_000,
        })
        console.info(receipt)
        this.hasAllowance = true
        this.showSpinner = false
      } catch (error) {
        this.hasAllowance = false
        this.showSpinner = false
        console.error(error)
        this.error = `Couldn't approve. ${error?.message}`
      }
    },
    async onSubmit() {
      this.error = ''
      this.showSuccess = false
      const web3 = this.sharedState.web3
      const config = this.sharedState.currentConfig
      if (!web3 || !config || !this.sharedState.accountAddress) {
        this.error = 'Need to connect a wallet'
        return
      }
      const receiverAddress = this.receiverAddress
      const token = this.selectedToken
      const tokenAddress = token?.address
      if (!tokenAddress) {
        this.selectedTokenError = 'Choose a token to cross'
        return
      }
      if (!receiverAddress) {
        this.error = 'Choose a Receiver address'
        return
      }
      if (!this.hasAllowance) {
        this.error = 'Need to approve first'
        return
      }

      if (!this.amount) {
        this.error = 'Complete the Amount field'
        return
      }
      this.showSpinner = true

      this.showModal = true

      try {
        const transactionSaved = await this.erc20TokenInstance.cross(
          this.amount,
          this.receiveAmount,
          token,
          this.sharedState.accountAddress.toLowerCase(),
          receiverAddress.toLowerCase(),
        )
        this.showSpinner = false
        this.showSuccess = true
        console.info('Transaction Saved')
        console.table(transactionSaved)
        this.$emit('newTransaction', transactionSaved)
        this.resetForm()
      } catch (error) {
        this.showSpinner = false
        this.showModal = false
        console.error(error)
        this.error = `Couln't cross the tokens. ${error?.message}`
      }
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
      if (!value) return 'destination address is required'
      if (!/^(0x)?[0-9a-f]{40}$/i.test(value)) {
        return 'invalid address'
      }
      return true
    },
    setClaimCost() {
      if (!this.sharedState.currentConfig) {
        return
      }
      const { isRsk } = this.sharedState?.currentConfig || {}
      const web3 = isRsk ? this.sharedState.sideWeb3 : this.sharedState.rskWeb3
      const networkConf = isRsk ? this.sharedState.sideConfig : this.sharedState.rskConfig
      web3.eth.getGasPrice().then(gasPrice => {
        const costInWei = new BigNumber(ESTIMATED_GAS_AVG)
          .multipliedBy(gasPrice)
          .shiftedBy(-18)
          .toPrecision(6)
          .toString()
        this.claimCost = `${costInWei} ${networkConf?.mainToken?.symbol}`
      })
    },
  },
}
</script>
<style scoped>
.alert {
  font-size: 12px;
  line-height: 14px;
  margin-bottom: 0;
}
.swap-btn {
  font-size: 5em;
  color: var(--primary);
}
.swap-btn:hover {
  color: var(--primary);
}
</style>
