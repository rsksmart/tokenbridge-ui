<template>
  <div class="transfer">
    <div class="transfer-title">
      <span>{{ title }}</span>
    </div>
    <div class="transfer-body">
      <div class="row">
        <div class="col-md-12">
          <label class="tokenAddress-label" for="networks">Origin Network</label>
          <div class="form-group">
            <select
              id="networks"
              v-model="currentNetwork"
              name="networks"
              class="form-control select-networks"
              :disabled="networks.length === 0 || disabled"
              @change="changeNetwork"
            >
              <option v-for="network in networks" :key="network.networkId" :value="network">
                {{ network.name }}
              </option>
            </select>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-4">
          <label class="tokenAddress-label" for="tokenAddress">
            Tokens to {{ isOrigin ? 'bridge' : 'receive' }}
          </label>
          <div class="dropdown">
            <button
              id="tokenAddress"
              class="btn dropdown-toggle"
              type="button"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
              :disabled="!currentNetwork || !isOrigin"
            >
              <span v-if="defaultToken?.symbol">
                <img
                  :src="defaultToken?.icon"
                  class="token-logo"
                  :alt="`${defaultToken?.name} Logo`"
                />
              </span>
              {{ defaultToken?.symbol ? defaultToken.symbol : 'Select a token' }}
            </button>
            <div
              v-if="currentNetwork && isOrigin"
              class="dropdown-menu"
              aria-labelledby="dropdownMenuButton"
            >
              <li v-for="token in tokens" :key="token.token">
                <a class="dropdown-item" href="#" @click="selectToken(token, $event)">
                  <span><img :src="token.icon" class="token-logo" /></span>
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
        <div class="col-8">
          <label class="amount-label" for="receive-amount">Amount</label>
          <div class="form-group amount">
            <input
              id="receive-amount"
              name="receiveAmount"
              class="form-control text-center align-center"
              type="number"
              min="0"
              :value="amount"
              :disabled="!currentNetwork || !isOrigin || !selectedToken?.token"
              @input="handleChangeAmount"
            />
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <label class="sender-label" for="sender-address">
            {{ isOrigin ? 'Sender' : 'Receiver' }} address
          </label>
          <div class="form-group transfer-address d-flex" :class="{ disabled: disabled }">
            <div
              class="address-container"
              :class="{
                'col-12': isOrigin,
                'col-6': !isOrigin,
                active: typeDestinationAddress === 'connected',
              }"
              @click="selectAddressType('connected', $event)"
            >
              <div>Connected Address:</div>
              <div>{{ connectedAddress }}</div>
            </div>
            <div
              v-if="!isOrigin"
              class="col-6 address-container"
              :class="{ active: typeDestinationAddress === 'different' }"
              @click="selectAddressType('different', $event)"
            >
              <div>Different Address</div>
              <div>
                <input
                  type="text"
                  class="form-control transfer-different-address"
                  :disabled="typeDestinationAddress === 'connected' || disabled"
                  :readonly="typeDestinationAddress === 'connected'"
                  @input="handleChangeAddress"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="transfer-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
import { store } from '@/store'
import BigNumber from 'bignumber.js'
import { boolean } from 'yup/lib/locale'

export default {
  name: 'Transfer',
  props: {
    amount: {
      required: true,
    },
    address: {
      type: String,
      required: false,
    },
    title: {
      type: String,
      required: true,
    },
    networks: {
      type: Array,
      required: true,
    },
    transferType: {
      type: String,
      required: true,
      validator(value) {
        return ['origin', 'destination'].includes(value)
      },
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    chainId: {
      type: [Number, String],
      default: '',
    },
    maxAmount: {
      type: [Number, String],
      default: '',
    },
    token: {
      type: Object,
      default: () => ({}),
    },
    switchNetwork: {
      type: Boolean,
      required: false,
    },
    switchNetworkError: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  emits: ['changeNetwork', 'selectToken', 'update:amount', 'update:address'],
  data() {
    return {
      sharedState: store.state,
      currentNetwork: null,
      oldNetwork: null,
      selectedToken: null,
      selectedTokenError: '',
      tokens: [],
      percentage: 0,
      typeDestinationAddress: 'connected',
    }
  },
  computed: {
    connectedAddress() {
      return this.sharedState.accountAddress
    },
    isOrigin() {
      return this.transferType === 'origin'
    },
    selectedNetwork() {
      return !this.disabled && this.isOrigin ? this.sharedState.currentConfig.networkId : ''
    },
    maxAmountBigNumber() {
      return new BigNumber(this.maxAmount)
    },
    defaultToken() {
      return Object.keys(this.token).length > 0 ? this.token : this.selectedToken
    },
  },
  watch: {
    currentNetwork(newNetwork, oldNetwork) {
      this.oldNetwork = oldNetwork;
    },
    switchNetworkError(value) {
      if(value && this.oldNetwork !== null) {
        this.currentNetwork = this.oldNetwork;
        this.oldNetwork = null
      }
    },
    percentage(newPercentage) {
      const percentage = newPercentage / 100
      const amount = this.maxAmountBigNumber.multipliedBy(percentage).toNumber()
      this.$emit('update:amount', amount)
    },
    networks: {
      deep: true,
      handler(newValue) {
        if (newValue.length > 0) {
          this.currentNetwork = newValue.find((network) => network.networkId === this.chainId)
          if (this.currentNetwork) {
            this.changeNetwork()
            this.selectAddressType('connected')
          }
        }
      },
    },
    switchNetwork(value) {
      if (value) {
        this.resetSelectedToken()
      }
    },
  },
  methods: {
    changeNetwork() {
      this.tokens = this.currentNetwork.tokens
      this.resetSelectedToken()
      this.$emit('changeNetwork', this.currentNetwork)
    },
    resetSelectedToken() {
      this.selectedToken = null
      this.selectToken(null, null)
    },
    selectToken(token, $event) {
      this.selectedToken = token
      this.$emit('selectToken', token, $event)
    },
    selectAddressType(type) {
      if (this.disabled) {
        return
      }
      this.typeDestinationAddress = type
      if (type === 'connected') {
        this.error = ''
        this.$emit('update:address', this.connectedAddress)
      } else {
        this.$emit('update:address', '')
      }
    },
    handleChangeAddress($event) {
      this.$emit('update:address', $event.target.value)
    },
    handleChangeAmount($event) {
      this.$nextTick(function () {
        const value = $event.target.value
        this.$emit('update:amount', value)
      })
    },
  },
}
</script>

<style scoped>
.transfer {
  border: 1px solid var(--primary);
  border-radius: 10px;
  padding: 24px;
  position: relative;
}
.transfer > .transfer-title {
  position: absolute;
  top: -15px;
  left: 0;
  text-align: center;
  width: 100%;
  font-size: medium;
}
.transfer-title > span {
  background-color: white;
  padding: 0 10px;
}

.transfer input,
.transfer select {
  border-radius: 100px;
}
.transfer-address {
  border-radius: 10px;
  background-color: rgba(0, 181, 32, 1);
}
.transfer-address.disabled {
  opacity: 0.3;
}
.transfer-address > .address-container {
  text-align: center;
  padding: 12px;
  cursor: pointer;
  color: white;
  border: 1px solid white;
  height: 7em;
}
.transfer-address > .address-container:first-child {
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
}
.transfer-address > .address-container:last-child {
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
}

.transfer-address > .address-container > div {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.transfer-address > .address-container.active {
  background-color: white;
  border: 1px solid rgb(0, 181, 32);
  color: black;
}

.transfer-address.disabled > .address-container {
  background-color: rgba(0, 181, 32, 0.2);
  border: 1px solid rgb(0, 181, 32);
  color: black;
  cursor: not-allowed;
}

input.transfer-different-address {
  border: 0;
  border-bottom: 1px solid rgb(0, 181, 32);
  background: transparent;
  border-radius: 0;
  width: 100%;
  outline: none;
}
input.transfer-different-address:focus {
  outline: none;
  box-shadow: none;
}

.holder {
  height: 3.7em;
}
</style>
