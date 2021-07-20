<template>
  <div>
    <section id="home">
      <div class="container">
        <Title :is-testnet="isTestnet" />

        <CrossForm
          :types-limits="typesLimits"
          :rsk-fee="rskFee"
          :eth-fee="ethFee"
          :rsk-confirmations="rskConfirmations"
          :eth-confirmations="ethConfirmations"
          @new-transaction="newTransaction = $event"
        />

        <TransactionList
          :types-limits="typesLimits"
          :rsk-confirmations="rskConfirmations"
          :eth-confirmations="ethConfirmations"
          :fed-members-len="rskFedMembers.length"
          :new-transaction="newTransaction"
        />

        <ImportantDetails
          :rsk-fee="rskFee"
          :eth-fee="ethFee"
          :rsk-confirmations="rskConfirmations"
          :eth-confirmations="ethConfirmations"
          :rsk-fed-members="rskFedMembers"
          :eth-fed-members="ethFedMembers"
        />

        <TokenList :types-limits="typesLimits" />
      </div>
      <!--- End Tab Content -->
    </section>
  </div>
</template>

<script>
// --------- import TOKENS and network CONFIG  --------------
import { TOKENS } from '@/constants/tokens.js'

// ------ ABIS -----
import BRIDGE_ABI from '@/constants/abis/bridge.json'
import ALLOW_TOKENS_ABI from '@/constants/abis/allowTokens.json'
import ERC20_ABI from '@/constants/abis/erc20.json'
import FEDERATION_ABI from '@/constants/abis/federation.json'

// external js packages
import BigNumber from 'bignumber.js'

import $ from 'jquery'
import 'popper.js'
import 'bootstrap'

import { Paginator, retry3Times, NULL_HASH, blocksToTime } from '@/utils'

import CrossForm from '@/components/crossForm/CrossForm.vue'
import Title from '@/components/title/Title.vue'
import TransactionList from '@/components/transactionList/TransactionList.vue'
import ImportantDetails from '@/components/importantDetails/ImportantDetails.vue'
import TokenList from '@/components/tokenList/TokenList.vue'
import { store } from '@/store.js'

export default {
  name: 'Home',
  components: {
    Title,
    CrossForm,
    ImportantDetails,
    TokenList,
    TransactionList,
  },
  data() {
    return {
      sharedState: store.state,
      isTestnet: false,
      typesLimits: [],
      rskFee: 0,
      ethFee: 0,
      rskConfirmations: {},
      ethConfirmations: {},
      rskFedMembers: [],
      ethFedMembers: [],
      newTransaction: null,
    }
  },
  created() {
    const data = this
    const rskWeb3 = this.sharedState.rskWeb3
    const rskConfig = this.sharedState.rskConfig
    const ethWeb3 = this.sharedState.ethWeb3
    const ethConfig = this.sharedState.ethConfig

    const rskBridge = new rskWeb3.eth.Contract(BRIDGE_ABI, rskConfig.bridge)
    rskBridge.methods
      .getFeePercentage()
      .call()
      .then(fee => {
        data.rskFee = fee / rskConfig.feePercentageDivider
      })

    const ethBridge = new ethWeb3.eth.Contract(BRIDGE_ABI, ethConfig.bridge)
    retry3Times(ethBridge.methods.getFeePercentage().call).then(fee => {
      data.ethFee = fee / ethConfig.feePercentageDivider
    })
    // We have the premice that the limits will be equal in ETH and in RSK
    // And the tokens wil have the same type on both networks
    const rskAllowTokens = new rskWeb3.eth.Contract(ALLOW_TOKENS_ABI, rskConfig.allowTokens)
    retry3Times(rskAllowTokens.methods.getTypesLimits().call).then(limits => {
      data.typesLimits = limits
    })

    retry3Times(rskAllowTokens.methods.getConfirmations().call).then(confirmations => {
      data.rskConfirmations = {
        smallAmount: confirmations.smallAmount,
        smallAmountTime: blocksToTime(confirmations.smallAmount, rskConfig.secondsPerBlock),
        mediumAmount: confirmations.mediumAmount,
        mediumAmountTime: blocksToTime(confirmations.mediumAmount, rskConfig.secondsPerBlock),
        largeAmount: confirmations.largeAmount,
        largeAmountTime: blocksToTime(confirmations.largeAmount, rskConfig.secondsPerBlock),
      }
    })

    const rskFederation = new rskWeb3.eth.Contract(FEDERATION_ABI, rskConfig.federation)
    retry3Times(rskFederation.methods.getMembers().call).then(
      members => (data.rskFedMembers = members),
    )

    const ethAllowTokens = new ethWeb3.eth.Contract(ALLOW_TOKENS_ABI, ethConfig.allowTokens)
    retry3Times(ethAllowTokens.methods.getConfirmations().call).then(confirmations => {
      data.ethConfirmations = {
        smallAmount: confirmations.smallAmount,
        smallAmountTime: blocksToTime(confirmations.smallAmount, ethConfig.secondsPerBlock),
        mediumAmount: confirmations.mediumAmount,
        mediumAmountTime: blocksToTime(confirmations.mediumAmount, ethConfig.secondsPerBlock),
        largeAmount: confirmations.largeAmount,
        largeAmountTime: blocksToTime(confirmations.largeAmount, ethConfig.secondsPerBlock),
      }
    })

    const ethFederation = new ethWeb3.eth.Contract(FEDERATION_ABI, ethConfig.federation)
    retry3Times(ethFederation.methods.getMembers().call).then(
      members => (data.ethFedMembers = members),
    )

    const vNode = this

    //User
    let address = ''
    let eth2RskPaginationObj = {}
    let rsk2EthPaginationObj = {}

    //Network configuration
    let config = null
    let bridgeContract = null

    // Selected Token To Cross
    let tokenContract = null

    $(document).ready(function() {
      if (vNode.sharedState.isTestnet) {
        let navlink = $('#network-navlink')
        navlink.prop('href', 'https://tokenbridge.rsk.co')
        navlink.text('Use Mainnet')
        navlink = $('#get-rbtc-navlink')
        navlink.prop('href', 'https://faucet.rsk.co/')
      }

      if (
        !/chrom(e|ium)/.test(navigator.userAgent.toLowerCase()) &&
        navigator.userAgent.indexOf('Firefox') == -1
      ) {
        alert('This site will only work correctly under chrome, chromium or firefox')
      }

      $('#changeNetwork').on('click', function() {
        if (config) {
          var connectToNetwork = ''
          if (vNode.sharedState.isTestnet) {
            if (config.crossToNetwork.networkId == 42) {
              connectToNetwork = 'Kovan'
            } else {
              connectToNetwork = 'RSK Testnet'
            }
          } else {
            if (config.crossToNetwork.networkId == 1) {
              connectToNetwork = 'Ethereum'
            } else {
              connectToNetwork = 'RSK Mainnet'
            }
          }
          updateNetworkConfig(config.crossToNetwork)
          var err = new Error(
            `Switch the Network.<br /> Please connect your wallet to <b>${connectToNetwork}</b>`,
          )
          onMetaMaskConnectionError(err)
        }
      })
    })

    function onLogInClick() {
      if (!config) {
        $('#logIn').html('<i class="fas fa-sync fa-spin">')
        $('#logIn').off('click')
        isInstalled().catch(err => {
          onMetaMaskConnectionError(typeof err === 'string' ? { message: err } : err)
        })
      }
    }

    function onPreviousTxnClick() {
      if (
        $('#nav-eth-rsk-tab')
          .attr('class')
          .includes('active')
      ) {
        if (eth2RskPaginationObj != {} && eth2RskPaginationObj.pre_page == null) {
          // no decrement applied
        } else {
          eth2RskTablePage -= 1
        }
      } else {
        if (rsk2EthPaginationObj != {} && rsk2EthPaginationObj.pre_page == null) {
          // no decrement applied
        } else {
          rsk2EthTablePage -= 1
        }
      }
      showActiveAddressTXNs()
    }

    function onNextTxnClick() {
      if (
        $('#nav-eth-rsk-tab')
          .attr('class')
          .includes('active')
      ) {
        if (eth2RskPaginationObj != {} && eth2RskPaginationObj.next_page == null) {
          // no increment applied
        } else {
          eth2RskTablePage += 1
        }
      } else {
        if (rsk2EthPaginationObj != {} && rsk2EthPaginationObj.next_page == null) {
          // no increment applied
        } else {
          rsk2EthTablePage += 1
        }
      }

      showActiveAddressTXNs()
    }

    function crossTokenError(err) {
      $('#alert-danger-text').html(err)
      $('#alert-danger').show()
      $('#alert-danger').focus()
      // $('#cross').prop('disabled', false);
      $('#deposit').prop('disabled', false)

      // disableInputs(false)
    }

    async function checkAllowance() {
      // cleanAlertSuccess()
      let amount = $('#amount').val()
      if (amount == '') {
        // markInvalidAmount('Invalid amount')
        return
      }
      let parsedAmount = new BigNumber(amount)
      if (parsedAmount <= 0) {
        // markInvalidAmount('Must be bigger than 0')
        return
      }
      // $('#secondsPerBlock').text(config.secondsPerBlock)
      $('#amount').removeClass('ok')
      let totalCost = fee == 0 ? parsedAmount : parsedAmount.dividedBy(1 - fee)
      let tokenToCross = $('#tokenAddress').val()
      let token = TOKENS.find(element => element.token == tokenToCross)
      if (token) {
        const tokenAddress = token[config.networkId].address
        tokenContract = new vNode.sharedState.web3.eth.Contract(ERC20_ABI, tokenAddress)

        let allowance = await retry3Times(
          tokenContract.methods.allowance(address, bridgeContract.options.address).call,
        )
        allowance = vNode.sharedState.web3.utils.fromWei(allowance)
        let allowanceBN = new BigNumber(allowance)

        if (totalCost.lte(allowanceBN)) {
          // $('.approve-deposit').hide()
          // straight to convert
          // const crossDisabled = true //isReceiverAddressOk()
          // disableApproveCross({
          //   approvalDisable: true,
          //   doNotAskDisabled: true,
          //   crossDisabled: !crossDisabled,
          // })
          // $('.fees').show()
        } else {
          // user must first approve amount
          // disableApproveCross({
          //   approvalDisable: false,
          //   doNotAskDisabled: false,
          //   crossDisabled: true,
          // })
          // $('.approve-deposit').show()
        }
      }
    }

    function onMetaMaskConnectionError(err) {
      console.error(err)
      $('#myModal .modal-body').html(`<p>${err.message}</p>`)
      $('#myModal').modal('show')
      $('#logIn').on('click', onLogInClick)
      $('#logIn').text('Connect wallet')
      $('#logIn').show()
      $('#transferTab').addClass('disabled')
      $('#help').hide()
      $('.wallet-status').hide()
      $('#address').text('0x00000..')
      // disableInputs(true)
      tokenContract = null
      bridgeContract = null
      config = null
      address = ''
    }

    function updateNetworkConfig(config) {
      $('.fromNetwork').text(config.name)
      $('.indicator span').html(config.name)
      $('.indicator').removeClass('btn-outline-danger')
      $('.indicator').addClass('btn-outline-success')
      $('.toNetwork').text(config.crossToNetwork.name)
      $('#confirmations').html(config.confirmations)
      $('#timeToCross').html(config.crossToNetwork.confirmationTime)
      // updateTokenAddressDropdown(config.networkId)
    }

    async function getAccounts() {
      let accounts = await vNode.sharedState.web3.eth.getAccounts()
      if (accounts.length === 0)
        throw new Error(
          'Nifty Wallet or MetaMask is Locked, please unlock it and Reload the page to continue',
        )
      return accounts
    }
  },
}
</script>
