<template>
  <div class="important-details">
    <h2 class="subtitle">Important details</h2>
    <table class="table">
      <thead>
        <tr>
          <th scope="col"></th>
          <th scope="col">{{ sharedState.rskConfig.name }}</th>
          <th scope="col">{{ sharedState.ethConfig.name }}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row">Fee</th>
          <td>{{ rskFeeFormated }}</td>
          <td>{{ ethFeeFormated }}</td>
        </tr>
        <tr>
          <th scope="row">Confirmations needed for small amounts</th>
          <td>
            {{ rskConfirmations?.smallAmount }} blocks (~ {{ rskConfirmations?.smallAmountTime }})
          </td>
          <td>
            {{ ethConfirmations?.smallAmount }} blocks (~ {{ ethConfirmations?.smallAmountTime }})
          </td>
        </tr>
        <tr>
          <th scope="row">Confirmations needed for medium amounts</th>
          <td>
            {{ rskConfirmations?.mediumAmount }} blocks (~ {{ rskConfirmations?.mediumAmountTime }})
          </td>
          <td>
            {{ ethConfirmations?.mediumAmount }} blocks (~ {{ ethConfirmations?.mediumAmountTime }})
          </td>
        </tr>
        <tr>
          <th scope="row">Confirmations needed for large amounts</th>
          <td>
            {{ rskConfirmations?.largeAmount }} blocks (~ {{ rskConfirmations?.largeAmountTime }})
          </td>
          <td>
            {{ ethConfirmations?.largeAmount }} blocks (~ {{ ethConfirmations?.largeAmountTime }})
          </td>
        </tr>
        <tr>
          <th scope="row">Signatories</th>
          <td>{{ rskFedMembersLen }}</td>
          <td>{{ ethFedMembersLen }}</td>
        </tr>
      </tbody>
    </table>
    <!-- <div class="row mb-5">
      <div class="col-md-4 col-sm-4 mb-5 config-section">
        <span id="config-max" class="config-value mb-2">{{ maxAllowed }}</span>
        <span class="config-title">Max transfer allowed</span>
        <p>
          The max value of tokens that can be tranferred per operation
        </p>
      </div>
      <div class="col-md-4 col-sm-4 mb-5 config-section">
        <span id="config-min" class="config-value mb-2">{{ minAllowed }}</span>
        <span class="config-title">Min transfer allowed</span>
        <p>
          The min value of tokens that can be transferred per operation
        </p>
      </div>
      <div class="col-md-4 col-sm-4 mb-5 config-section">
        <span id="config-to-spend" class="config-value mb-2">{{ dailyLimit }}</span>
        <span class="config-title">Daily transfer limit</span>
        <p>
          How many tokens can be tranferred today
        </p>
      </div>
      <div class="col-md-4 col-sm-4 mb-5 config-section">
        <span id="config-fee" class="config-value mb-2">{{ fee }}</span>
        <span class="config-title">Fee</span>
        <p>
          This is the fee required for transfer tokens between networks
        </p>
      </div>
      <div class="col-md-4 col-sm-4 mb-5 config-section">
        <div>
          <span id="config-federators-count" class="config-value mb-2 ml-2">{{
            federatorsCount
          }}</span>
        </div>
        <span class="config-title">Federators</span>
        <p>
          The Authorities will vote the transactions to cross during the trial period. Once we
          implement the decentralized bridge there will be no authorities as its a fully trustless
          solution
        </p>
      </div>
      <div class="col-md-4 col-sm-4 mb-5 config-section">
        <span id="config-whitelisted-enabled" class="config-value mb-2">{{ crossingPeriod }}</span>
        <span class="config-title">Crossing period</span>
        <p>
          Time needed to have enough confirmations to securely cross assets to the other network
        </p>
      </div>
    </div> -->
  </div>
</template>

<script>
import { store } from '@/store.js'
import { blocksToTime } from '@/utils'
import ALLOW_TOKENS_ABI from '@/constants/abis/allowTokens.json'
import FEDERATION_ABI from '@/constants/abis/federation.json'

export default {
  name: 'ImportantDetails',
  props: {
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
      federatorsCount: 1,
      crossingPeriod: '5 minutes',
      rskConfirmations: {},
      ethConfirmations: {},
      rskFedMembers: [],
      ethFedMembers: [],
    }
  },
  computed: {
    rskFeeFormated() {
      return this.rskFee * 100 + '%'
    },
    ethFeeFormated() {
      return this.ethFee * 100 + '%'
    },
    rskFedMembersLen() {
      return this.rskFedMembers.length
    },
    ethFedMembersLen() {
      return this.ethFedMembers.length
    },
  },
  created() {
    // RSK
    const data = this
    const rskWeb3 = this.sharedState.rskWeb3
    const rskConfig = this.sharedState.rskConfig

    const rskAllowTokens = new rskWeb3.eth.Contract(ALLOW_TOKENS_ABI, rskConfig.allowTokens)
    rskAllowTokens.methods
      .getConfirmations()
      .call()
      .then(confirmations => {
        data.rskConfirmations = {
          smallAmount: confirmations.smallAmount,
          smallAmountTime: blocksToTime(confirmations.smallAmount, rskConfig.secondsPerBlock),
          mediumAmount: confirmations.mediumAmount,
          mediumAmountTime: blocksToTime(confirmations.mediumAmount, rskConfig.secondsPerBlock),
          largeAmount: confirmations.largeAmount,
          largeAmountTime: blocksToTime(confirmations.largeAmount, rskConfig.secondsPerBlock),
        }
      })

    const rskFederation = new rskWeb3.eth.Contract(FEDERATION_ABI, rskConfig.federation)
    rskFederation.methods
      .getMembers()
      .call()
      .then(members => (data.rskFedMembers = members))

    // ETH
    const ethWeb3 = this.sharedState.ethWeb3
    const ethConfig = this.sharedState.ethConfig

    const ethAllowTokens = new ethWeb3.eth.Contract(ALLOW_TOKENS_ABI, ethConfig.allowTokens)
    ethAllowTokens.methods
      .getConfirmations()
      .call()
      .then(confirmations => {
        data.ethConfirmations = {
          smallAmount: confirmations.smallAmount,
          smallAmountTime: blocksToTime(confirmations.smallAmount, ethConfig.secondsPerBlock),
          mediumAmount: confirmations.mediumAmount,
          mediumAmountTime: blocksToTime(confirmations.mediumAmount, ethConfig.secondsPerBlock),
          largeAmount: confirmations.largeAmount,
          largeAmountTime: blocksToTime(confirmations.largeAmount, ethConfig.secondsPerBlock),
        }
      })

    const ethFederation = new ethWeb3.eth.Contract(FEDERATION_ABI, ethConfig.federation)
    ethFederation.methods
      .getMembers()
      .call()
      .then(members => (data.ethFedMembers = members))
  },
}
</script>

<style scoped>
/* .config-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
.config-section .config-value {
  font-size: 36px;
  font-weight: bold;
  color: #00b520;
}
.config-section .config-title {
  font-weight: bold;
}
.config-section .config-address {
  font-size: 13px;
  color: #00b520;
  font-weight: bold;
}
.fed-addresses {
  text-align: left;
  display: block;
}
.config-section p {
  font-size: 11px;
  line-height: 14px;
  margin: 0 20px;
} */
</style>
