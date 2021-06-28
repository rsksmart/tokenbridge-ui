<template>
  <div class="container" @network-change="updateNetworksInfo">
    <div v-if="isTestnet" div class="bridge-info">
      <h1 id="title">RSK Testnet bridge with Kovan</h1>
      <h5 class="bridge-info-subtitle">
        You can convert your tokens from RSK Testnet to Ethereum Kovan and viceversa.
      </h5>
    </div>
    <div v-else class="bridge-info">
      <h1 id="title">RSK bridge with Ethereum</h1>
      <h5 class="bridge-info-subtitle">
        You can convert your tokens from RSK to Ethereum and viceversa.
      </h5>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Title',
  props: {
    isTestnet: {
      type: Boolean,
      default: true,
    },
  },
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
