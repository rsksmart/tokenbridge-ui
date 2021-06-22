<template>
  <div v-on:network-change="updateNetworksInfo" class="container">
    <div v-if="isTestnet" div class="bridge-info">
      <h1 id="title">RSK Testnet bridges with Ethereum Kovan</h1>
      <h5 class="bridge-info-subtitle">You can convert your tokens from RSK Testnet to Ethereum Kovan and viceversa.</h5>
    </div>
    <div v-else class="bridge-info">
      <h1 id="title">RSK bridges with Ethereum</h1>
      <h5 class="bridge-info-subtitle">You can convert your tokens from RSK to Ethereum and viceversa.</h5>
    </div>
    <div class="row justify-content-center">
      <div class="text-center col-lg-4 col-md-6 col-12">
          <img src="@/assets/img/logo.jpg" alt="token bridge logo">
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'BridgeInfo',
  props: {
    isTestnet: {
      type: Boolean,
      default: true
    }
  }
}
</script>
<style scoped>
.bridge-info {
  text-align: center;
  margin-bottom: 20px;
}
.bridge-info .subtitle {
  text-align: center;
  margin-bottom: 5px;
}
</style>
