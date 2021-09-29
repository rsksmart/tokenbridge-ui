<template>
  <Form id="nftForm" ref="nftForm" name="nftForm" @submit="onSubmit">
    <h3 class="text-primary">
      Destination Network <strong class="text-secondary">{{ destinationNetwork.name }}</strong>
    </h3>
    <div class="form-row">
      <div class="form-group col-md-6">
        <label for="nftReceiverAddress" class="form-label">
          <a id="same-address" class="same-address" @click="useSameAddress">
            Receiver address
          </a>
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
import { ESTIMATED_GAS_AVG } from '@/constants/transactions'
import { txExplorerLink } from '@/utils/text-helpers'
import { waitForReceipt } from '@/utils'

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
    }
  },
  async created() {
    const web3 = this.sharedState.web3
    this.nftBridgeContract = new web3.eth.Contract(NFT_BRIDGE, this.sharedState.sideConfig.nftBridge)
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
      const currentConfig = this.sharedState.currentConfig
      const web3 = this.sharedState.web3
      try {
        const gasPrice = await store.getGasPriceHex()
        const transaction = await new Promise((resolve, reject) => {
          this.nftBridgeContract.methods
            .receiveTokensTo(this.nftContractAddress, this.nftReceiverAddress, this.tokenId)
            .send(
              {
                from: this.sharedState.accountAddress,
                gasPrice: gasPrice,
                gas: ESTIMATED_GAS_AVG,
              },
              async (err, txHash) => {
                const txExplorerLinkRes = txExplorerLink(txHash, currentConfig.explorer)
                if (err) {
                  reject(new Error(`Execution failed ${err.message} ${txExplorerLinkRes}`))
                }
                try {
                  const receipt = await waitForReceipt(txHash, web3)
                  if (receipt.status) {
                    resolve(receipt)
                  } else {
                    reject(
                      new Error(`Transaction status failed ${err?.message || ''} ${txExplorerLinkRes}`),
                    )
                  }
                } catch (error) {
                  reject(new Error(`${error} ${txExplorerLinkRes}`))
                }
              },
            )
        })

        // const transactionRecord = {
        //     type: 'NFT',
        //     networkId: currentConfig.networkId,
        //     tokenFrom: token.symbol,
        //     tokenTo: token.receiveToken.symbol,
        //     amount: data.amount,
        //     receiveAmount: data.receiveAmount,
        //     senderAddress: data.sharedState.accountAddress,
        //     receiverAddress,
        //     timestamp: Date.now(),
        //     ...receipt,
        //   }
        //   const accountsAddresses = [data.sharedState.accountAddress.toLowerCase()]
        //   if (data.sharedState.accountAddress.toLowerCase() !== receiverAddress.toLowerCase()) {
        //     accountsAddresses.push(receiverAddress.toLowerCase())
        //   }
        //   // save transaction to local storage...
        //   const newTransaction = {
        //     ...transactionRecord,
        //     accountsAddresses,
        //   }
        //   await this.$services.TransactionService.saveTransaction(newTransaction)

        return {
          success: true,
          data: transaction,
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
      return await this.onSubmit()
    },
    useSameAddress(event) {
      if (event) event.preventDefault()
      this.nftReceiverAddress = this.sharedState.accountAddress
    },
  },
}
</script>

<style scoped></style>
