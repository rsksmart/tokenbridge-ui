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
import {
  KOVAN_CONFIG,
  RSK_TESTNET_CONFIG,
  ETH_CONFIG,
  RSK_MAINNET_CONFIG,
} from '@/constants/networks.js'
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
    ethBridge.methods
      .getFeePercentage()
      .call()
      .then(fee => {
        data.ethFee = fee / ethConfig.feePercentageDivider
      })
    // We have the premice that the limits will be equal in ETH and in RSK
    // And the tokens wil have the same type on both networks
    const rskAllowTokens = new rskWeb3.eth.Contract(ALLOW_TOKENS_ABI, rskConfig.allowTokens)
    rskAllowTokens.methods
      .getTypesLimits()
      .call()
      .then(limits => {
        data.typesLimits = limits
      })

    rskAllowTokens.methods
      .getConfirmations()
      .call()
      .then(confirmations => {
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
    rskFederation.methods
      .getMembers()
      .call()
      .then(members => (data.rskFedMembers = members))

    const ethAllowTokens = new ethWeb3.eth.Contract(ALLOW_TOKENS_ABI, ethConfig.allowTokens)
    ethAllowTokens.methods
      .getConfirmations()
      .call()
      .then(confirmations => {
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
    ethFederation.methods
      .getMembers()
      .call()
      .then(members => (data.ethFedMembers = members))

    const vNode = this

    //User
    let address = ''
    let activeAddressEth2RskTxns = []
    let eth2RskTablePage = 1
    let eth2RskPaginationObj = {}
    let activeAddressRsk2EthTxns = []
    let rsk2EthTablePage = 1
    let rsk2EthPaginationObj = {}

    //Network configuration
    let config = null
    let bridgeContract = null
    let currentBlockNumber = null

    // Selected Token To Cross
    let tokenContract = null

    $(document).ready(function() {
      // $('.selectpicker').selectpicker()

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

      // $('.table').on('click', '.claim', function(e) {
      //   e.preventDefault()
      //   const url = e.currentTarget.closest('tr').querySelector('.confirmed').href
      //   const txHash = url.slice(url.indexOf('tx/') + 3)

      //   let txn
      //   if (config.name.toLowerCase().includes('eth')) {
      //     txn = activeAddressRsk2EthTxns.find(x => x.transactionHash === txHash)
      //   } else {
      //     txn = activeAddressEth2RskTxns.find(x => x.transactionHash === txHash)
      //   }
      //   if (!txn) {
      //     alert('You need to switch the network to claim this')
      //     return
      //   }
      //   claim(txn, e.currentTarget)
      // })

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
      // isInstalled(); - uncomment to show popup on page load
    })

    async function waitForReceipt(txHash) {
      let timeElapsed = 0
      let interval = 10_000
      return new Promise((resolve, reject) => {
        const checkInterval = setInterval(async () => {
          timeElapsed += interval
          let receipt = await vNode.sharedState.web3.eth.getTransactionReceipt(txHash)
          if (receipt != null) {
            clearInterval(checkInterval)
            resolve(receipt)
          }
          if (timeElapsed > 190_000) {
            reject(
              new Error(
                `Operation took too long <a target="_blank" href="${config.explorer}/tx/${txHash}">check Tx on the explorer</a>`,
              ),
            )
          }
        }, interval)
      })
    }

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

    // async function isInstalled() {
    //   if (window.ethereum) {
    //     window.ethereum.autoRefreshOnNetworkChange = false
    //   }

    //   await vNode.handleLogin()

    //   let accounts = await getAccounts()
    //   let chainId = await vNode.sharedState.web3.eth.net.getId()
    //   await updateCallback(chainId, accounts)

    //   vNode.sharedState.provider.on('chainChanged', function(newChain) {
    //     updateNetwork(newChain)
    //     showActiveTxnsTab()
    //   })
    //   vNode.sharedState.provider.on('accountsChanged', function(newAddresses) {
    //     checkAllowance()
    //     updateAddress(newAddresses)
    //       .then(addr => updateActiveAddressTXNs(addr))
    //       .then(() => showActiveAddressTXNs())
    //   })
    //   return chainId
    // }

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

    // function onMetaMaskConnectionSuccess() {
    //   // disableInputs(false)
    //   disableApproveCross({
    //     approvalDisable: true,
    //     doNotAskDisabled: true,
    //     crossDisabled: true,
    //   })
    // }

    // function updateAddress(newAddresses) {
    //   address = newAddresses[0]
    //   $('#address').text(address)
    //   $('#logIn').hide()
    //   $('#transferTab').removeClass('disabled')
    //   $('#help').show()
    //   $('.wallet-status').show()

    //   return Promise.resolve(address)
    // }

    // function updateActiveAddressTXNs(addr) {
    //   if (config.name.toLowerCase().includes('eth')) {
    //     activeAddressEth2RskTxns = TXN_Storage.getAllTxns4Address(addr, config.name)
    //     activeAddressRsk2EthTxns = TXN_Storage.getAllTxns4Address(addr, config.crossToNetwork.name)
    //   } else {
    //     activeAddressRsk2EthTxns = TXN_Storage.getAllTxns4Address(addr, config.name)
    //     activeAddressEth2RskTxns = TXN_Storage.getAllTxns4Address(addr, config.crossToNetwork.name)
    //   }
    // }

    // async function showActiveAddressTXNs() {
    //   if (!address || (!activeAddressEth2RskTxns.length && !activeAddressRsk2EthTxns.length)) {
    //     return
    //   }

    //   $('#txn-previous')
    //     .off()
    //     .on('click', onPreviousTxnClick)
    //   $('#txn-next')
    //     .off()
    //     .on('click', onNextTxnClick)

    //   let eth2RskTable = $('#eth-rsk-tbody')
    //   let rsk2EthTable = $('#rsk-eth-tbody')

    //   eth2RskPaginationObj = Paginator(activeAddressEth2RskTxns, eth2RskTablePage, 3)
    //   let { data: eth2RskTxns } = eth2RskPaginationObj

    //   rsk2EthPaginationObj = Paginator(activeAddressRsk2EthTxns, rsk2EthTablePage, 3)
    //   let { data: rsk2EthTxns } = rsk2EthPaginationObj

    //   const processTxn = async (txn, networkConfig, blockNumber, sideWeb3) => {
    //     const { confirmations, secondsPerBlock, explorer } = networkConfig

    //     let elapsedBlocks = blockNumber - txn.blockNumber
    //     let remainingBlocks2Confirmation = confirmations - elapsedBlocks
    //     let status = 'Info Not Available'
    //     if (txn.blockNumber > networkConfig.v2UpdateBlock) {
    //       // V2 Protocol
    //       const sideBridgeContract = new sideWeb3.eth.Contract(
    //         BRIDGE_ABI,
    //         networkConfig.crossToNetwork.bridge,
    //       )
    //       const txDataHash = await sideBridgeContract.methods
    //         .transactionsDataHashes(txn.transactionHash)
    //         .call()
    //       if (txDataHash === NULL_HASH) status = '<span class="pending"> Pending</span>'
    //       else {
    //         const claimed = await sideBridgeContract.methods.claimed(txDataHash).call()
    //         if (claimed) {
    //           status = '<span class="confirmed"> Claimed</span>'
    //         } else {
    //           status = '<span><button class="btn btn-primary claim">Claim</button></span>'
    //         }
    //       }
    //     } else {
    //       // V1 Protocol
    //       status =
    //         elapsedBlocks >= confirmations
    //           ? `<span class="confirmed"> Confirmed</span>`
    //           : `<span class="pending"> Pending</span>`
    //     }

    //     let seconds2Confirmation =
    //       remainingBlocks2Confirmation > 0 ? remainingBlocks2Confirmation * secondsPerBlock : 0

    //     let hoursToConfirmation = Math.floor(seconds2Confirmation / 60 / 60)
    //     let hoursToConfirmationStr = hoursToConfirmation > 0 ? `${hoursToConfirmation}hs ` : ''
    //     let minutesToConfirmation = Math.floor(seconds2Confirmation / 60) - hoursToConfirmation * 60
    //     let humanTimeToConfirmation =
    //       elapsedBlocks < confirmations
    //         ? `| ~ ${hoursToConfirmationStr} ${minutesToConfirmation}mins`
    //         : ''

    //     let txnExplorerLink = `${explorer}/tx/${txn.transactionHash}`
    //     let shortTxnHash = `${txn.transactionHash.substring(0, 8)}...${txn.transactionHash.slice(
    //       -8,
    //     )}`

    //     let htmlRow = `<tr class="black">
    //             <th scope="row"><a href="${txnExplorerLink}">${shortTxnHash}</a></th>
    //             <td>${txn.blockNumber}</td>
    //             <td>${txn.amount} ${txn.tokenFrom}</td>
    //             <td>${status} ${humanTimeToConfirmation}</td>
    //         </tr>`

    //     return htmlRow
    //   }

    //   let rskConfig = config
    //   let ethConfig = config.crossToNetwork
    //   let rskWeb3 = vNode.sharedState.web3
    //   let ethWeb3 = new Web3(config.crossToNetwork.rpc)
    //   let rskBlockNumber = currentBlockNumber
    //   let ethBlockNumber = await ethWeb3.eth.getBlockNumber()
    //   if (config.name.toLowerCase().includes('eth')) {
    //     rskConfig = config.crossToNetwork
    //     ethConfig = config
    //     rskWeb3 = new Web3(config.crossToNetwork.rpc)
    //     ethWeb3 = vNode.sharedState.web3
    //     rskBlockNumber = await rskWeb3.eth.getBlockNumber()
    //     ethBlockNumber = currentBlockNumber
    //   }
    //   const activeAddressTXNsEth2RskRowsPromises = Promise.all(
    //     eth2RskTxns.map(txn => {
    //       return processTxn(txn, ethConfig, ethBlockNumber, rskWeb3)
    //     }),
    //   )
    //   const activeAddressTXNsRsk2EthRowsPromises = Promise.all(
    //     rsk2EthTxns.map(txn => {
    //       return processTxn(txn, rskConfig, rskBlockNumber, ethWeb3)
    //     }),
    //   )

    //   const activeAddressTXNsEth2RskRows = await activeAddressTXNsEth2RskRowsPromises
    //   const activeAddressTXNsRsk2EthRows = await activeAddressTXNsRsk2EthRowsPromises
    //   eth2RskTable.html(activeAddressTXNsEth2RskRows.join())
    //   rsk2EthTable.html(activeAddressTXNsRsk2EthRows.join())
    // }

    async function updateCallback(chainId, accounts) {
      return updateNetwork(chainId)
        .then(() => updateAddress(accounts))
        .then(addr => updateActiveAddressTXNs(addr))
        .then(() => showActiveAddressTXNs())
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

    async function updateNetwork(newNetwork) {
      // cleanAlertSuccess()
      try {
        newNetwork = parseInt(newNetwork)
        if (config && config.networkId == newNetwork) return

        config = null
        if (vNode.sharedState.isTestnet) {
          switch (newNetwork) {
            case 42:
              config = KOVAN_CONFIG
              break
            case 31:
              config = RSK_TESTNET_CONFIG
              break
          }
        } else {
          switch (newNetwork) {
            case 1:
              config = ETH_CONFIG
              break
            case 30:
              config = RSK_MAINNET_CONFIG
              break
          }
        }
        if (config == null) {
          $('.fromNetwork').text('From Network')
          $('.indicator span').html('Unknown Network')
          $('.indicator').removeClass('btn-outline-success')
          $('.indicator').addClass('btn-outline-danger')
          $('.toNetwork').text('To Network')
          $('#willReceiveToken').html('-')
          throw new Error(
            `Wrong Network.<br /> Please connect your wallet to <b>${
              vNode.sharedState.isTestnet ? 'RSK Testnet or Kovan' : 'RSK Mainnet or Ethereum'
            }</b>`,
          )
        }
        // const allowTokensContract = new vNode.sharedState.web3.eth.Contract(
        //   ALLOW_TOKENS_ABI,
        //   config.allowTokens,
        // )
        // bridgeContract = new vNode.sharedState.web3.eth.Contract(BRIDGE_ABI, config.bridge)
        // const federationContract = new vNode.sharedState.web3.eth.Contract(
        //   FEDERATION_ABI,
        //   config.federation,
        // )

        $('#myModal').modal('hide')
        updateNetworkConfig(config)
        // updateTokenAddressDropdown(config.networkId)

        // onMetaMaskConnectionSuccess()

        // if (TXN_Storage.isStorageAvailable('localStorage')) {
        //   console.log(`Local Storage Available!`)
        // } else {
        //   console.log(`Local Storage Unavailable!`)
        // }
      } catch (err) {
        onMetaMaskConnectionError(err)
        throw err
      }
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
