<template>
  <Form id="nftForm" ref="nftForm" name="nftForm" @submit="onSubmit">
    <h3 class="text-primary">
      Origin Network <strong class="text-secondary">{{ originNetwork.name }}</strong>
    </h3>
    <div class="form-row">
      <div class="form-group col-md-6">
        <label for="nftAddress" class="form-label">NFT Address</label>
        <Field
          id="nftAddress"
          v-model="nftContractAddress"
          type="text"
          class="outline form-control"
          name="nftAddress"
          placeholder="0x00...af"
          :disabled="disabled"
          required
        />
        <div class="invalid-feedback-container">
          <ErrorMessage class="invalid-feedback" name="nftAddress" />
        </div>
      </div>
      <div class="form-group col-md-2">
        <label for="tokenId" class="form-label">Token ID</label>
        <Field
          id="tokenId"
          v-model="tokenId"
          type="text"
          class="outline form-control"
          name="tokenId"
          :disabled="disabled"
          required
        />
        <div class="invalid-feedback-container">
          <ErrorMessage class="invalid-feedback" name="nftAddress" />
        </div>
      </div>
      <div class="form-group col-md-2">
        <button
          id="submitBtn"
          class="btn btn-primary btn-lg mt-4"
          type="submit"
          :disabled="disabled"
        >
          <span
            v-if="isLoading"
            class="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
          ></span>
          Get Info
        </button>
      </div>
    </div>
  </Form>
</template>

<script>
import { Form, Field, ErrorMessage } from 'vee-validate'
import { store } from '@/store'
import SIDE_NFT_TOKEN from '@/constants/abis/side_nft_token.json'
import { asyncTryCatch } from '@/utils/try-catch'

export default {
  name: 'NFTForm',
  components: { Form, Field, ErrorMessage },
  inject: ['$modal'],
  props: {
    originNetwork: {
      type: Object,
      required: true,
    },
  },
  emits: ['onSuccess'],
  data() {
    return {
      sharedState: store.state,
      isLoading: false,
      tokenId: '',
      nftContractAddress: '',
      metadata: {
        description: '',
        image: '',
        name: '',
        external_link: '',
        link: '',
      },
    }
  },
  computed: {
    disabled() {
      return !this.sharedState.isConnected || this.isLoading
    },
  },
  methods: {
    async getMetadata(erc721, tokenURI, isApprovedForAll) {
      const [uriError, response] = await asyncTryCatch(fetch, this.formatTokenURI(tokenURI), {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (uriError) {
        this.$modal.value.showModal({
          type: 'error',
          options: {
            modalProps: { message: uriError.message, title: 'Error trying to recover metadata' },
          },
        })
        this.isLoading = false
        return
      }
      try {
        const metadata = await response.json()
        this.metadata = { ...metadata, link: tokenURI }
        this.$emit('onSuccess', {
          metadata: this.metadata,
          web3Contract: erc721,
          nftContractAddress: this.nftContractAddress,
          isApprovedForAll,
          tokenId: this.tokenId,
          isApproved: isApprovedForAll,
        })
        this.isLoading = false
      } catch (jsonError) {
        this.isLoading = false
        this.$modal.value.showModal({
          type: 'error',
          options: { modalProps: { message: jsonError.message, title: 'Error on Metadata info' } },
        })
      }
    },
    async onSubmit() {
      const web3 = this.sharedState.web3
      const erc721 = new web3.eth.Contract(SIDE_NFT_TOKEN, this.nftContractAddress)
      this.isLoading = true

      const [tokenURIError, tokenURI] = await asyncTryCatch(
        erc721.methods.tokenURI(this.tokenId).call,
      )

      const [approvedError, isApprovedForAll] = await asyncTryCatch(
        erc721.methods.isApprovedForAll(
          this.sharedState.accountAddress,
          this.sharedState.currentConfig.nftBridge,
        ).call,
      )

      if (approvedError) {
        this.$modal.value.showModal({
          type: 'error',
          options: {
            modalProps: { message: approvedError.message, title: 'Error checking approved status' },
          },
        })
        this.isLoading = false
        return
      }
      if (!tokenURIError && tokenURI) {
        await this.getMetadata(erc721, tokenURI, isApprovedForAll)
      } else {
        const metadata = {
          description:
            '🚨 Attention:\nFailed on load metadata information, you can continue with the cross action.\n',
        }
        this.$emit('onSuccess', {
          metadata,
          web3Contract: erc721,
          nftContractAddress: this.nftContractAddress,
          isApprovedForAll,
          tokenId: this.tokenId,
          isApproved: isApprovedForAll,
        })
        this.isLoading = false
      }
    },
    formatTokenURI: function(tokenURI) {
      // TODO: check conversion from ipfs to https
      let match = tokenURI.match('ipfs://(ipfs/.+)')
      if (match?.length > 1) {
        tokenURI = `https://ipfs.io/${match[1]}`
      }
      tokenURI = `${process.env.VUE_APP_PROXY_CORS_URI}${tokenURI}`
      return tokenURI
    },
  },
}
</script>

<style scoped></style>
