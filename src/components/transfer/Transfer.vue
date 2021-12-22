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
        <div class="col-8">
          <label class="amount-label" for="receive-amount">Amount</label>
          <div class="form-group amount">
            <input
              id="receive-amount"
              name="receiveAmount"
              class="form-control text-center align-center"
              type="number"
              min="0"
              :max="maxAmount"
              :value="amount"
              :disabled="!currentNetwork || !isOrigin"
              @input="handleChangeAmount"
            />
            <div v-if="isOrigin">
              <RangeInput v-model:value="percentage" step="25" :disabled="!currentNetwork" />
            </div>
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
import RangeInput from '@/components/rangeInput/RangeInput'
import BigNumber from 'bignumber.js'

export default {
  name: 'Transfer',
  components: { RangeInput },
  props: {
    amount: {
      type: [Number, String],
      required: true,
    },
    address: {
      type: String,
      required: true,
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
  },
  emits: ['changeNetwork', 'selectToken', 'update:amount', 'update:address'],
  data() {
    return {
      sharedState: store.state,
      currentNetwork: null,
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
    amount(newAmount, prevAmount) {
      console.log('Amount change', newAmount)
      this.$emit('update:amount', newAmount)
    },
    percentage(newPercentage, prevPercentage) {
      const percentage = newPercentage / 100
      const amount = this.maxAmountBigNumber.multipliedBy(percentage).toNumber()
      this.$emit('update:amount', amount)
    },
    networks: {
      deep: true,
      handler(newValue, oldValue) {
        if (newValue.length > 0) {
          this.currentNetwork = newValue.find(network => network.networkId === this.chainId)
          if (this.currentNetwork) {
            this.changeNetwork()
            this.selectAddressType('connected')
          }
        }
      },
    },
  },
  methods: {
    changeNetwork() {
      this.tokens = this.currentNetwork.tokens
      this.$emit('changeNetwork', this.currentNetwork)
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
        this.$emit('update:address', this.connectedAddress)
      } else {
        this.$emit('update:address', '')
      }
    },
    handleChangeAddress($event) {
      this.$emit('update:address', $event.target.value);
    },
    handleChangeAmount($event) {
      const value = $event.target.value
      if (this.maxAmountBigNumber.isLessThan(value)) {
        $event.preventDefault()
      } else {
        this.$emit('update:amount', $event.target.value)
      }
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
input.range-slider {
  appearance: none;
  width: 100%;
  height: 12px;
  outline: none;
  opacity: 0.7;
  transition: opacity 0.2s;
  border-radius: 5px;
  background-size: 70% 100%;
  background: rgba(255, 255, 255, 0.6) linear-gradient(var(--primary), var(--primary)) no-repeat;
}
input.range-slider:hover {
  opacity: 1;
}
input.range-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 25px;
  height: 25px;
  background: var(--primary);
  cursor: ew-resize;
  border-radius: 50%;
  box-shadow: 0 0 2px 0 #555;
  transition: background 0.3s ease-in-out;
}
input.range-slider::-webkit-slider-runnable-track {
  -webkit-appearance: none;
  box-shadow: none;
  border: none;
  background: transparent;
}
</style>
