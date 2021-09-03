<template>
  <div class="nft-wrapper container p-5 my-5">
    <div class="row">
      <div class="col-md-12">
        <NFTForm :origin-network="originNetwork" @onSuccess="handleOnSuccess" />
      </div>
      <div v-if="displayInformation" class="col-md-12 p-2">
        <NFTViewInformation
          :destination-network="destinationNetwork"
          :metadata="metadata"
        ></NFTViewInformation>
      </div>
    </div>
  </div>
</template>

<script>
import NFTViewInformation from '@/components/nftForm/NFTViewInformation'
import NFTForm from '@/components/nftForm/NFTForm'
import { store } from '@/store'

export default {
  name: 'NFTWrapper',
  components: { NFTViewInformation, NFTForm },
  data() {
    return {
      nftAddress: '',
      tokenId: '',
      sharedState: store.state,
      metadata: {},
      displayInformation: false,
    }
  },
  computed: {
    originNetwork() {
      return this.sharedState.currentConfig || this.sharedState.rskConfig
    },
    destinationNetwork() {
      return this.sharedState.currentConfig?.crossToNetwork || this.sharedState.ethConfig
    },
  },
  methods: {
    handleOnSuccess(metadata) {
      this.metadata = metadata
      this.displayInformation = true
    },
  },
}
</script>

<style scoped>
.nft-wrapper {
  border: 2px solid var(--primary);
  border-radius: 10px;
}
</style>
