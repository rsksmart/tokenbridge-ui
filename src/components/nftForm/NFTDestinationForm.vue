<template>
  <Form id="nftForm" ref="nftForm" name="nftForm" @submit="onSubmit">
    <h3 class="text-primary">
      Destination Network <strong class="text-secondary">{{ destinationNetwork.name }}</strong>
    </h3>
    <div class="form-row">
      <div class="form-group col-md-6">
        <label for="nftReceiverAddress" class="form-label">NFT Address</label>
        <Field
          id="nftReceiverAddress"
          v-model="nftReceiverAddress"
          type="text"
          class="outline form-control"
          name="nftReceiverAddress"
          placeholder="0x00...af"
          rules="required"
          required
        />
        <div class="invalid-feedback-container">
          <ErrorMessage class="invalid-feedback" name="nftReceiverAddress" />
        </div>
      </div>
      <div class="form-group col-md-3  text-center">
        <label for="feePrice" class="form-label">Fee Amount</label>
        <Field
          id="feePrice"
          v-model="feePrice"
          type="text"
          class="form-control-plaintext text-center align-center"
          name="feePrice"
          placeholder="0x00...af"
          required
          disabled
          readonly
        />
      </div>
    </div>
  </Form>
</template>

<script>
import { ErrorMessage, Field, Form } from 'vee-validate'
import { store } from '@/store'
import NFT_BRIDGE from '@/constants/abis/nft-bridge.json'
import { asyncTryCatch } from '@/utils/try-catch'
import { ESTIMATED_GAS_AVG } from '@/constants/transactions'

export default {
  name: 'NFTDestinationForm',
  components: { Form, Field, ErrorMessage },
  props: {
    destinationNetwork: {
      type: Object,
      required: true,
    },
    web3Contract: {
      type: Object,
      required: true,
    },
    nftContractAddress: {
      type: String,
      required: true,
    },
    tokenId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      sharedState: store.state,
      nftReceiverAddress: '',
      feePrice: 0,
      nftBridgeContract: null,
    }
  },
  async created() {
    const web3 = this.sharedState.web3
    this.nftBridgeContract = new web3.eth.Contract(NFT_BRIDGE, this.nftContractAddress)
    try {
      const fee = await this.nftBridgeContract.methods.getFixedFee().call()
      this.feePrice = fee
    } catch (feeError) {
      console.error(feeError)
    }
  },
  methods: {
    async onSubmit() {
      const gasPrice = await store.getGasPriceHex()
      this.nftBridgeContract.methods
        .receiveTokensTo(this.nftContractAddress, this.nftReceiverAddress, this.tokenId)
        .send({
          from: this.nftContractAddress,
          gasPrice: gasPrice,
          gas: ESTIMATED_GAS_AVG,
        })
    },
    async handleSubmitExternal() {
      const { valid } = await this.$refs.nftForm.validate()
      if (!valid) {
        return
      }
      await this.$refs.nftForm.onSubmit()
    },
  },
}
</script>

<style scoped></style>
