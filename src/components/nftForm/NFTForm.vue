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
import { isEmptyAddress } from "@/utils/text-helpers";

export default {
  name: 'NFTForm',
  components: { Form, Field, ErrorMessage },
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
    async onSubmit() {
      console.log('OnSubmit')
      const web3 = this.sharedState.web3
      const erc721 = new web3.eth.Contract(SIDE_NFT_TOKEN, this.nftContractAddress)

      const [tokenURIError, uri] = await asyncTryCatch(erc721.methods.tokenURI(this.tokenId).call)
      if (tokenURIError) {
        console.error(tokenURIError)
        return
      }
      const [approvedError, addressApproved] = await asyncTryCatch(
        erc721.methods.getApproved(this.tokenId).call,
      )
      console.log('Address Approve', addressApproved)
      if (approvedError) {
        console.error(approvedError)
        return
      }
      const [uriError, response] = await asyncTryCatch(fetch, uri)
      if (uriError) {
        console.error(uriError)
        return
      }
      try {
        const metadata = await response.json()
        this.metadata = { ...metadata, link: uri }
        this.$emit('onSuccess', {
          metadata: this.metadata,
          web3Contract: erc721,
          nftContractAddress: this.nftContractAddress,
          addressApproved,
          tokenId: this.tokenId,
          isApproved: !isEmptyAddress(addressApproved),
        })
      } catch (jsonError) {
        console.error(jsonError)
      }
    },
  },
}
</script>

<style scoped></style>
