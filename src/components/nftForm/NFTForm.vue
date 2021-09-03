<template>
  <div>
    <Form id="nftForm" ref="nftForm" name="nftForm" @submit="onSubmit">
      <h3 class="text-primary">
        Origin <strong>{{ originNetwork.name }}</strong>
      </h3>
      <div class="form-row">
        <div class="form-group col-md-6">
          <label for="nftAddress" class="form-label">NFT Address</label>
          <Field
            id="nftAddress"
            v-model="nftAddress"
            type="text"
            class="outline form-control"
            name="nftAddress"
            placeholder="0x00...af"
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
            required
          />
          <div class="invalid-feedback-container">
            <ErrorMessage class="invalid-feedback" name="nftAddress" />
          </div>
        </div>
        <div class="form-group col-md-2">
          <button id="submitBtn" class="btn btn-primary btn-lg mt-4" type="submit">
            Get Info
          </button>
        </div>
      </div>
    </Form>
  </div>
</template>

<script>
import { Form, Field, ErrorMessage } from 'vee-validate'
import { store } from '@/store'
import ERC721_ABI from '@/constants/abis/erc721.json'

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
      tokenId: '',
      nftAddress: '',
      metadata: {
        description: '',
        image: '',
        name: '',
        external_link: '',
        link: '',
      },
    }
  },
  methods: {
    async onSubmit() {
      const web3 = this.sharedState.web3
      const erc721 = new web3.eth.Contract(ERC721_ABI, this.nftAddress)
      console.log(erc721)
      const uri = await erc721.methods.tokenURI(this.tokenId).call()
      console.log(uri)
      const response = await fetch(uri)
      const metadata = await response.json()
      this.metadata = { ...metadata, link: uri }
      this.$emit('onSuccess', this.metadata)
    },
  },
}
</script>

<style scoped></style>
