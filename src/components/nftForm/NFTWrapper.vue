<template>
  <div>
    <div class="nft-wrapper container p-5 mt-5">
      <div class="row">
        <div class="col-md-12 p-2">
          <NFTForm
            :origin-network="originNetwork"
            @onSuccess="handleOnSuccess"
            @onLoading="handleOnLoading"
            @onFailed="handleOnFailed"
          />
        </div>
        <div v-if="displayInformation" class="col-md-12 p-2">
          <NFTViewInformation :metadata="metadata"></NFTViewInformation>
        </div>
        <div v-if="displayInformation" class="col-md-12 p-2">
          <NFTDestinationForm
            ref="destinationForm"
            :destination-network="destinationNetwork"
            :web3-contract="web3Contract"
            :nft-contract-address="nftContractAddress"
            :token-id="tokenId"
          ></NFTDestinationForm>
        </div>
      </div>
    </div>
    <div class="p-5">
      <div class="row justify-content-center">
        <button
          v-if="!isApproved"
          class="nft-btn btn btn-primary mr-3"
          :disabled="!loadedInfo || isLoadingApprove"
          @click="handleApprove"
        >
          <span
            v-if="isLoadingApprove"
            class="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
          ></span>
          Approve
        </button>
        <button
          class="nft-btn btn btn-primary"
          :disabled="!loadedInfo || !isApproved || isLoadingCross"
          @click="handleCrossNFT"
        >
          <span
            v-if="isLoadingCross"
            class="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
          ></span>
          Cross NFT
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import NFTViewInformation from '@/components/nftForm/NFTViewInformation'
import NFTForm from '@/components/nftForm/NFTForm'
import { store } from '@/store'
import NFTDestinationForm from '@/components/nftForm/NFTDestinationForm'
import ERC721NFTTransaction from '@/modules/transactions/transactionsTypes/ERC721NFTTransaction'

export default {
  name: 'NFTWrapper',
  components: { NFTViewInformation, NFTForm, NFTDestinationForm },
  inject: ['$modal'],
  props: {
    rskFee: {
      type: Number,
      required: true,
    },
    sideFee: {
      type: Number,
      required: true,
    },
  },
  emits: ['newTransaction'],
  data() {
    return {
      loadedInfo: false,
      nftAddress: '',
      tokenId: '',
      sharedState: store.state,
      metadata: {},
      displayInformation: false,
      web3Contract: null,
      nftContractAddress: '',
      isApproved: false,
      isLoadingApprove: false,
      isLoadingCross: false,
    }
  },
  computed: {
    originNetwork() {
      return this.sharedState.currentConfig || this.sharedState.rskConfig
    },
    destinationNetwork() {
      return this.sharedState.currentConfig?.crossToNetwork || this.sharedState.sideConfig
    },
  },
  methods: {
    resetState() {
      this.displayInformation = false
      this.metadata = {}
      this.web3Contract = null
      this.nftContractAddress = ''
      this.tokenId = ''
      this.isApproved = false
      this.loadedInfo = false
    },
    handleOnLoading() {
      this.resetState()
    },
    handleOnFailed() {
      this.resetState()
    },
    handleOnSuccess({ metadata, web3Contract, nftContractAddress, tokenId, isApproved }) {
      this.metadata = metadata
      this.displayInformation = true
      this.web3Contract = web3Contract
      this.nftContractAddress = nftContractAddress
      this.tokenId = tokenId
      this.isApproved = isApproved
      this.loadedInfo = true
    },
    async handleCrossNFT() {
      this.isLoadingCross = true
      try {
        const submitResponse = await this.$refs.destinationForm.handleSubmitExternal()
        if (submitResponse.success) {
          this.$modal.value.showModal({
            type: 'success',
            options: { modalProps: { message: 'Success Operation' } },
          })
        }
        this.isLoadingCross = false
        this.$emit('newTransaction', submitResponse.data)
      } catch (error) {
        this.$modal.value.showModal({
          type: 'error',
          options: { modalProps: { message: error.message } },
        })
        this.isLoadingCross = false
      }
    },
    async handleApprove() {
      const currentConfig = this.sharedState.currentConfig
      const web3 = this.sharedState.web3
      const accountAddress = this.sharedState.accountAddress
      this.isLoadingApprove = true
      try {
        const erc721NFTTransaction = new ERC721NFTTransaction({
          web3,
          config: currentConfig,
        })
        await erc721NFTTransaction.approve(this.nftContractAddress, {
          from: accountAddress,
          gas: 70_000,
        })
        this.isLoadingApprove = false
        this.isApproved = true
      } catch (approvalError) {
        this.isLoadingApprove = false
        this.$modal.value.showModal({
          type: 'error',
          options: { modalProps: { message: `Approve failed: ${approvalError.message}` } },
        })
      }
    },
  },
}
</script>

<style scoped>
.nft-wrapper {
  border: 2px solid var(--primary);
  border-radius: 10px;
}
.nft-btn {
  min-width: 10em;
}
</style>
