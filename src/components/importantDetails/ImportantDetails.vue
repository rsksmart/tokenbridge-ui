<template>
  <div id="infoTab">
    <h5 class="subtitle">Important details</h5>
    <div class="row mb-5">
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
    </div>
  </div>
</template>
<script>
export default {
  name: 'ImportantDetails',
  data() {
    return {
      maxAllowed: '10,000',
      minAllowed: '1',
      dailyLimit: '100,000',
      fee: '0.20 %',
      federatorsCount: 1,
      crossingPeriod: '5 minutes',
    }
  },
}
</script>
<style scoped>
.config-section {
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
}
</style>
