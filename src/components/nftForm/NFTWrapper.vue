<template>
  <div>
    <div class="nft-wrapper container p-5 mt-5">
      <div class="row">
        <div class="col-md-12 p-2">
          <NFTForm :origin-network="originNetwork" @onSuccess="handleOnSuccess" />
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
          class="btn btn-primary"
          :disabled="!loadedInfo"
          @click="handleApprove"
        >
          Approve
        </button>
        <button class="btn btn-primary" :disabled="!loadedInfo" @click="handleCrossNFT">
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
import SIDE_NFT_TOKEN from '@/constants/abis/side_nft_token.json'
import { waitForReceipt } from '@/utils'
import { txExplorerLink } from '@/utils/text-helpers'

export default {
  name: 'NFTWrapper',
  components: { NFTViewInformation, NFTForm, NFTDestinationForm },
  props: {
    rskFee: {
      type: Number,
      required: true,
    },
    ethFee: {
      type: Number,
      required: true,
    },
  },
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
      await this.$refs.destinationForm.handleSubmitExternal()
    },
    async handleApprove() {
      const currentConfig = this.sharedState.currentConfig
      // TODO: Check Correct address
      const bridgeAddress = currentConfig.bridge
      const web3 = this.sharedState.web3
      const accountAddress = this.sharedState.accountAddress
      try {
        const tokenContract = new web3.eth.Contract(SIDE_NFT_TOKEN, this.nftContractAddress)
        const gasPrice = await store.getGasPriceHex()

        return new Promise((resolve, reject) => {
          tokenContract.methods
            .setApprovalForAll(bridgeAddress, false)
            .send({ from: accountAddress, gasPrice, gas: 70_000 }, async (err, txHash) => {
              const txExplorerLinkRes = txExplorerLink(txHash, currentConfig.explorer)
              if (err) {
                throw new Error(`Execution failed ${err.message} ${txExplorerLinkRes}`)
              }
              try {
                const receipt = await waitForReceipt(txHash, web3)
                if (receipt.status) {
                  return resolve(receipt)
                } else {
                  return reject(
                    new Error(`Transaction status failed ${err.message} ${txExplorerLinkRes}`),
                  )
                }
              } catch (error) {
                return reject(new Error(`${error} ${txExplorerLinkRes}`))
              }
            })
        })

      } catch (approvalError) {
        console.error('Approve failed: ' + JSON.stringify(approvalError))
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
</style>
