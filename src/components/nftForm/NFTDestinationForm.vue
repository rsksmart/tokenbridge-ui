<template>
  <Form id="nftForm" ref="nftForm" name="nftForm" @submit="onSubmit">
    <h3 class="text-primary">
      Destination Network <strong class="text-secondary">{{ destinationNetwork.name }}</strong>
    </h3>
    <div class="form-row">
      <div class="form-group col-md-6">
        <label for="nftReceiverAddress" class="form-label">
          <a id="same-address" class="same-address" @click="useSameAddress"> Receiver address </a>
        </label>
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
      <div class="form-group col-md-3 text-center">
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
import { ESTIMATED_GAS_AVG } from '@/constants/transactions'
import ERC721NFTTransaction from '@/modules/transactions/transactionsTypes/ERC721NFTTransaction'

export default {
  name: 'NFTDestinationForm',
  components: { Form, Field, ErrorMessage },
  inject: ['$modal'],
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
      erc721NFTInstance: null,
    }
  },
  async created() {
    const web3 = this.sharedState.web3
    this.erc721NFTInstance = new ERC721NFTTransaction({
      web3,
      config: this.sharedState.currentConfig,
    })
    this.nftBridgeContract = new web3.eth.Contract(
      NFT_BRIDGE,
      this.sharedState.currentConfig.nftBridge,
    )
    try {
      const fee = await this.nftBridgeContract.methods.getFixedFee().call()
      this.feePrice = fee
    } catch (feeError) {
      this.$modal.value.showModal({
        type: 'error',
        options: { modalProps: { title: 'Getting Fee', message: feeError.message } },
      })
    }
  },
  methods: {
    async onSubmit() {
      try {
        const transactionSaved = await this.erc721NFTInstance.cross(
          this.nftContractAddress,
          this.nftReceiverAddress,
          this.tokenId,
          {
            from: this.sharedState.accountAddress,
            gas: ESTIMATED_GAS_AVG,
          },
        )
        return {
          success: true,
          data: transactionSaved,
        }
      } catch (error) {
        this.$modal.value.showModal({
          type: 'error',
          options: { modalProps: { title: 'Error Crossing NFT', message: error.message } },
        })
        return {
          success: false,
          data: { message: error.message },
        }
      }
    },
    async handleSubmitExternal() {
      const { valid } = await this.$refs.nftForm.validate()
      if (!valid) {
        return
      }
      return this.onSubmit()
    },
    useSameAddress(event) {
      if (event) event.preventDefault()
      this.nftReceiverAddress = this.sharedState.accountAddress
    },
  },
}
</script>

<style scoped></style>
