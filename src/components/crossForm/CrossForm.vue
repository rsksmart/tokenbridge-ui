import { all } from 'cypress/types/bluebird'
<template>
  <div class="row">
    <div class="offset-md-2 col-md-8 col-12">
      <p v-if="showSendToContractWarning" class="alert alert-warning" role="alert">
        Sending directly to smart contracts may result in the lose of funds
      </p>
    </div>
  </div>
  <div class="row">
    <div class="offset-md-2 col-md-8 col-12">
      <p v-if="showAddressWarning" class="alert alert-warning" role="alert">
        Sending founds directly to exchange may result in loses if they don't support transactions
        sent by smart contracts
      </p>
    </div>
  </div>

  <div class="row">
    <div class="col-5">
      <Transfer
        v-model:amount="amount"
        v-model:max-amount="maxAmount"
        title="Origin"
        :networks="originNetworks"
        transfer-type="origin"
        :disabled="disabled"
        :chain-id="originNetwork?.networkId"
        :switch-network-error="errorOnSwitchNetwork"
        @changeNetwork="handleChangeNetwork"
        @selectToken="selectToken"
      >
        <template v-if="!disabled" #footer>
          <div class="alert alert-secondary text-span">
            Transaction will require at least
            <strong>{{ confirmations.blocks ?? '0' }}</strong> confirmations
          </div>
        </template>
      </Transfer>
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
        v-model:switchNetwork="switchNetwork"
        title="Destination"
        :networks="destinationNetworks"
        transfer-type="destination"
        :disabled="disabled"
        :chain-id="destinationNetwork?.networkId"
        :token="willReceiveToken"
        @changeNetwork="handleChangeDestinationNetwork"
      >
        <template v-if="!disabled" #footer>
          <div class="alert alert-danger text-span">
            You'll need <strong>{{ claimCost }}</strong> to claim the tokens
          </div>
        </template>
      </Transfer>
    </div>
  </div>
  <div class="row justify-content-center mt-4">
    <button
      v-if="!hasAllowance"
      id="approve"
      class="btn btn-primary mr-3"
      :disabled="disabledActionButtons"
      @click="approveClick"
    >
      Approve
    </button>
    <button
      id="deposit"
      class="btn btn-primary"
      :disabled="disabledActionButtons || !hasAllowance"
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
    <template #title> How to obtain the tokens </template>
    <template #body>
      <p>When the transaction is mined you will see it like</p>
      <img src="pending-tx.png" alt="pending transaction" />
      <p>Once it has enough confirmation you will need to <b>claim it on the other network</b></p>
      <img src="claim-tx.png" alt="claim transaction" />
    </template>
  </Modal>
</template>
<script>
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
      maxAmount: 0,
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
      switchNetwork: false,
      error: '',
      claimCost: null,
      erc20TokenInstance: null,
      // this is the new values
      originNetworkSelected: null,
      originNetworks: [],
      destinationNetworks: [],
      receiveAmount: new BigNumber(0),
      showAddressWarning: false,
      showSendToContractWarning: false,
      errorOnSwitchNetwork: false,
      wrongReceiverAddress: false,
    }
  },
  computed: {
    confirmations() {
      let dataToReturn = {}
      if (
        !this.sharedState.currentConfig ||
        isNaN(this.amount) ||
        isNaN(this.typesLimits?.length) ||
        isNaN(this.selectedToken?.typeId)
      ) {
        return dataToReturn
      }

      const config = this.sharedState.currentConfig
      const confirmations = config.isRsk ? this.rskConfirmations : this.sideConfirmations
      // convert amount to wei to compare against limits
      const amount = new BigNumber(this.amount).shiftedBy(18)
      const limit = this.typesLimits[this.selectedToken?.typeId]
      if (amount.isLessThan(limit.mediumAmount)) {
        dataToReturn = {
          blocks: confirmations.smallAmount,
          time: moment
            .duration(confirmations.smallAmount * config.secondsPerBlock, 'seconds')
            .add(2, 'minutes') // voting time
            .humanize(),
        }
      } else if (amount.isLessThan(limit.largeAmount)) {
        dataToReturn = {
          blocks: confirmations.mediumAmount,
          time: moment
            .duration(confirmations.mediumAmountTime * config.secondsPerBlock, 'seconds')
            .add(2, 'minutes') // voting time
            .humanize(),
        }
      } else {
        dataToReturn = {
          blocks: confirmations.largeAmount,
          time: moment
            .duration(confirmations.largeAmountTime * config.secondsPerBlock, 'seconds')
            .add(2, 'minutes') // voting time
            .humanize(),
        }
      }
      return dataToReturn
    },
    accountConnected() {
      return `${this.sharedState.chainId || ''} ${this.sharedState.accountAddress || ''} ${
        this.sharedState.sideConfig?.networkId || ''
      }`.trim()
    },
    fee() {
      if (!this.sharedState.currentConfig) return this.rskFee
      return this.sharedState.currentConfig.isRsk ? this.rskFee : this.sideFee
    },
    disabled() {
      return !this.sharedState.isConnected || this.showSpinner
    },
    disabledActionButtons() {
      return (
        !this.sharedState.isConnected ||
        this.showSpinner ||
        this.receiverAddress === '' ||
        this.wrongReceiverAddress ||
        this.amount <= 0 ||
        !this.selectedToken?.symbol ||
        this.receiveAmount === 0
      )
    },
    disabledAmount() {
      return !this.sharedState.isConnected || this.showSpinner || !this.selectedToken?.token
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
    waitSeconds() {
      if (!this.sharedState.currentConfig || !this.selectedTokenMediumAmount || !this.amount) {
        return 0
      }
      return this.sharedState.currentConfig.secondsPerBlock
    },
  },
  watch: {
    amount: function (newValue) {
      if (newValue > 0) {
        const maxValue = Math.min(
          this.selectedTokenMaxLimit.toString(),
          this.selectedTokenBalance.toString(),
        )
        this.error = ''
        this.showSuccess = false
        const minValue = Math.min(newValue, maxValue)
        const bgAmount = new BigNumber(minValue)
        this.$nextTick(() => {
          this.amount = bgAmount.toString()
          this.receiveAmount = bgAmount.minus(bgAmount.times(this.fee))
          this.hasAllowanceCheck()
        })
      } else {
        this.receiveAmount = new BigNumber(0)
      }
    },
    accountConnected(newValue) {
      if (this.isMounted && newValue) {
        this.handleOnAccountConnected()
      }
    },
    async receiverAddress(address) {
      try {
        if (address === '' || address !== this.sharedState.accountAddress) {
          this.showAddressWarning = true
        } else {
          this.showAddressWarning = false
        }
        const web3 = this.sharedState.sideWeb3
        const code = await web3.eth.getCode(address)
        if (code !== '0x') {
          this.wrongReceiverAddress = true
          this.showSendToContractWarning = true
        } else {
          this.wrongReceiverAddress = false
          this.showSendToContractWarning = false
        }
      } catch (err) {
        console.error('Wrong address')
        this.wrongReceiverAddress = true
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
    async handleChangeNetwork(network) {
      this.errorOnSwitchNetwork = false
      try {
        const chainId = numToHex(network.networkId)
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId }],
        })

        const networksConf = getNetworksConf(network.networkId)
        this.originNetworkSelected = network
        this.destinationNetworks = networksConf?.networks.map((record) => record.crossToNetwork)
      } catch (error) {
        if (error.code === 4902) {
          await this.handleAddNetwork(network)
        }
        this.errorOnSwitchNetwork = true
      }
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
          (net) => net.networkId === originNetwork.networkId,
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
      this.switchNetwork = true
      try {
        const chainId = numToHex(this.sharedState.currentConfig.crossToNetwork.networkId)
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId }],
        })
        this.selectedToken = {}
        this.willReceiveToken = null
        
      } catch (error) {
        console.log(error)
        if (error.code === 4902) {
          await this.handleAddNetwork(this.sharedState.currentConfig.crossToNetwork)
        }
      }
      
      this.hasAllowanceCheck();
      this.switchNetwork = false
    },
    handleOnAccountConnected() {
      this.refreshBalanceAndAllowance().then(() => {
        this.setClaimCost()
        this.initData()
        if (this.accountConnected) {
          store.initNetworkSettings()
        }
      })
    },
    initData() {
      this.erc20TokenInstance = new ERC20TokenTransaction({
        web3: this.sharedState.web3,
        config: this.sharedState.currentConfig,
      })
      this.originNetworks = getNonDuplicateNetworks()
    },
    resetForm() {
      this.willReceiveToken = null
      this.amount = 0
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
          if (this.selectedTokenBalance.toFixed(decimals) == 0) {
            this.amount = 0
          } else {
            this.amount = this.selectedTokenBalance.toFixed(decimals)
          }
        }
        this.hasAllowance = true
      } else {
        const tokenContract = new web3.eth.Contract(ERC20_ABI, token.address)
        const balance = await retry3Times(
          tokenContract.methods.balanceOf(this.sharedState.accountAddress).call,
        )
        this.selectedTokenBalance = new BigNumber(balance).shiftedBy(-decimals)
        if (new BigNumber(this.amount).isGreaterThan(this.selectedTokenBalance)) {
          if (this.selectedTokenBalance.toFixed(decimals) == 0) {
            this.amount = 0
          } else {
            this.amount = this.selectedTokenBalance.toFixed(decimals)
          }
        }

        await this.hasAllowanceCheck()
      }
    },
    async hasAllowanceCheck() {
      const web3 = this.sharedState.web3
      const config = this.sharedState.currentConfig
      const token = this.selectedToken
      const decimals = token.decimals

      const tokenContract = new web3.eth.Contract(ERC20_ABI, token.address)
      const allowance = await retry3Times(
        tokenContract.methods.allowance(this.sharedState.accountAddress, config.bridge).call,
      )

      this.hasAllowance = (
        new BigNumber(allowance).shiftedBy(-decimals).lte(this.selectedTokenMaxLimit) &&
        new BigNumber(allowance).shiftedBy(-decimals).gte(this.amount) &&
        new BigNumber(allowance).shiftedBy(-decimals).gt(new BigNumber(0))
      )
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
      const maxValue = new BigNumber(parseInt(this.amount)).shiftedBy(this.selectedToken.decimals);
      console.log(maxValue.toString());

      try {
        this.showSpinner = true
        const receipt = await this.erc20TokenInstance.approve(tokenAddress, maxValue, {
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
      if (value < 0) {
        return 'amount need to be greater than 0'
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
      const destinationNetworkConfig = isRsk
        ? this.sharedState.sideConfig
        : this.sharedState.rskConfig

      web3.eth.getGasPrice().then((gasPrice) => {
        const costInWei = new BigNumber(ESTIMATED_GAS_AVG)
          .multipliedBy(gasPrice)
          .shiftedBy(-18)
          .toPrecision(6)
          .toString()
        this.claimCost = `${costInWei} ${destinationNetworkConfig.gasToken?.symbol}`
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
.text-span {
  border-radius: 20px;
}
.successMessage {
  width: 90%;
  margin: auto;
  color: #fff;
  background-color: #00b520;
  border-radius: 50px;
  padding: 10px;
  text-align: center;
}
</style>
