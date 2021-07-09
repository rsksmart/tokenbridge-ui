<template>
  <div>
    <section id="home">
      <div class="container">
        <Title :is-testnet="isTestnet" />

        <CrossForm :types-limits="typesLimits" :rsk-fee="rskFee" :eth-fee="ethFee" />

        <div id="previousTxnsEmptyTab">
          <h2 class="subtitle">Active account transactions</h2>
          <p class="text-center">
            Please note that all transactions listed here will not appear if you use another device
          </p>
          <h2 class="subtitle">No transactions for active account found</h2>
        </div>

        <div id="previousTxnsTab">
          <h2 class="subtitle">Active account transactions</h2>
          <nav>
            <div id="nav-tab" class="nav nav-tabs" role="tablist">
              <a
                id="nav-rsk-eth-tab"
                class="nav-item nav-link active"
                data-toggle="tab"
                href="#nav-rsk-eth"
                role="tab"
                aria-controls="nav-rsk-eth"
                aria-selected="true"
                >RSK -> ETH</a
              >
              <a
                id="nav-eth-rsk-tab"
                class="nav-item nav-link"
                data-toggle="tab"
                href="#nav-eth-rsk"
                role="tab"
                aria-controls="nav-eth-rsk"
                aria-selected="false"
                >ETH -> RSK</a
              >
            </div>
          </nav>
          <div id="nav-tabContent" class="tab-content">
            <div
              id="nav-rsk-eth"
              class="tab-pane fade show active"
              role="tabpanel"
              aria-labelledby="nav-rsk-eth-tab"
            >
              <table class="table">
                <thead>
                  <tr>
                    <th scope="col">Txn hash</th>
                    <th scope="col">Block number</th>
                    <th scope="col">Amount</th>
                    <th scope="col">Status | Estimated time</th>
                  </tr>
                </thead>
                <tbody id="rsk-eth-tbody">
                  <!-- Dinamic content made with JS -->
                </tbody>
              </table>
            </div>
            <div
              id="nav-eth-rsk"
              class="tab-pane fade"
              role="tabpanel"
              aria-labelledby="nav-eth-rsk-tab"
            >
              <!-- Dinamic content made with JS -->
              <table class="table">
                <thead>
                  <tr>
                    <th scope="col">Txn hash</th>
                    <th scope="col">Block number</th>
                    <th scope="col">Amount</th>
                    <th scope="col">Status | Estimated time</th>
                  </tr>
                </thead>
                <tbody id="eth-rsk-tbody">
                  <!-- Dinamic content made with JS -->
                </tbody>
              </table>
            </div>
          </div>
          <div class="btn-toolbar" role="toolbar" aria-label="Toolbar with button groups">
            <div class="btn-group mr-2" role="group" aria-label="First group">
              <button id="txn-previous" type="button" class="btn btn-secondary">
                &lt; previous
              </button>
              <button id="txn-next" type="button" class="btn btn-secondary">next ></button>
            </div>
          </div>
        </div>

        <ImportantDetails :rsk-fee="rskFee" :eth-fee="ethFee" />

        <TokenList :types-limits="typesLimits" />
      </div>
      <!--- End Tab Content -->
    </section>
    <!-- Modal -->
    <div id="myModal" class="modal fade" tabindex="-1" role="dialog">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body"></div>
        </div>
      </div>
    </div>
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
import Web3 from 'web3'

import $ from 'jquery'
import 'popper.js'
import 'bootstrap'

import { Paginator, retry3Times, poll4LastBlockNumber, TXN_Storage, NULL_HASH } from '@/utils'

import CrossForm from '@/components/crossForm/CrossForm.vue'
import Title from '@/components/title/Title.vue'
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
  },
  data() {
    return {
      sharedState: store.state,
      isTestnet: false,
      typesLimits: [],
      rskFee: 0,
      ethFee: 0,
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
      .then(fee => (data.rskFee = fee / rskConfig.feePercentageDivider))

    const ethBridge = new ethWeb3.eth.Contract(BRIDGE_ABI, ethConfig.bridge)
    ethBridge.methods
      .getFeePercentage()
      .call()
      .then(fee => (data.ethFee = fee / ethConfig.feePercentageDivider))
    // We have the premice that the limits will be equal in ETH and in RSK
    // And the tokens wil have the same type on both networks
    const rskAllowTokens = new rskWeb3.eth.Contract(ALLOW_TOKENS_ABI, rskConfig.allowTokens)
    rskAllowTokens.methods
      .getTypesLimits()
      .call()
      .then(function(limits) {
        data.typesLimits = limits
      })

    const vNode = this

    //User
    let address = ''
    let receiverAddress = ''
    let activeAddressEth2RskTxns = []
    let eth2RskTablePage = 1
    let eth2RskPaginationObj = {}
    let activeAddressRsk2EthTxns = []
    let rsk2EthTablePage = 1
    let rsk2EthPaginationObj = {}

    //Network configuration
    let config = null
    let allowTokensContract = null
    let bridgeContract = null
    let federationContract = null
    let minTokensAllowed = 1
    let maxTokensAllowed = 100_000
    let maxDailyLimit = 1_000_000
    let currentBlockNumber = null

    // Selected Token To Cross
    let tokenContract = null
    let feePercentage = 0
    let fee = 0
    let feePercentageDivider = 10_000

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

      // disableInputs(true)
      disableApproveCross({
        approvalDisable: true,
        doNotAskDisabled: true,
        crossDisabled: true,
      })

      $('#logIn').on('click', onLogInClick)

      // $('#tokenAddress').change(function(event) {
      //   cleanAlertSuccess()
      //   let token = TOKENS.find(element => element.token == event.currentTarget.value)
      //   if (token) {
      //     $('.selectedToken').html(token[config.networkId].symbol)
      //     let html = `<a target="_blank" href="${config.crossToNetwork.explorer}/address/${token[
      //       config.crossToNetwork.networkId
      //     ].address.toLowerCase()}">`
      //     html += `\n   <span><img src="${token.icon}" class="token-logo"></span>${
      //       token[config.crossToNetwork.networkId].symbol
      //     }`
      //     html += `\n </a>`
      //     $('#willReceiveToken').html(html)
      //     $('#willReceive-copy').show()
      //     $('#willReceive-copy').attr(
      //       'data-clipboard-text',
      //       token[config.crossToNetwork.networkId].address,
      //     )
      //     if ($('#amount').val()) {
      //       isAmountOk()
      //       isReceiverAddressOk()
      //       checkAllowance()
      //     }
      //   } else {
      //     $('.selectedToken').html('')
      //     $('#willReceive').html('')
      //     $('#willReceive-copy').hide()
      //   }
      // })

      // $('#receive-address').change(function() {
      //   if (isReceiverAddressOk()) {
      //     receiverAddress = $('#receive-address').val()
      //   }
      // })

      // $('#receive-address').focusout(function() {
      //   if (isReceiverAddressOk()) {
      //     receiverAddress = $('#receive-address').val()
      //   }
      // })

      $('#amount').keyup(function(event) {
        isAmountOk()
        if (event.key === 'Enter') {
          checkAllowance()
        }
      })
      $('#amount').focusout(checkAllowance)
      $('#amount').keypress(function(event) {
        if (event.key !== '.' && (event.key < '0' || event.key > '9')) {
          return false
        }
      })
      $('#crossForm').on('submit', function(e) {
        e.preventDefault()
        crossToken()
      })

      $('#approve').on('click', function(e) {
        e.preventDefault()
        approveSpend()
      })

      $('.table').on('click', '.claim', function(e) {
        e.preventDefault()
        const url = e.currentTarget.closest('tr').querySelector('.confirmed').href
        const txHash = url.slice(url.indexOf('tx/') + 3)

        let txn
        if (config.name.toLowerCase().includes('eth')) {
          txn = activeAddressRsk2EthTxns.find(x => x.transactionHash === txHash)
        } else {
          txn = activeAddressEth2RskTxns.find(x => x.transactionHash === txHash)
        }
        if (!txn) {
          alert('You need to switch the network to claim this')
          return
        }
        claim(txn, e.currentTarget)
      })

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

    // async function getMaxBalance(event) {
    //   if (event) event.preventDefault()
    //   let tokenToCross = $('#tokenAddress').val()
    //   let token = TOKENS.find(element => element.token == tokenToCross)
    //   if (!token) {
    //     return
    //   }
    //   const tokenAddress = token[config.networkId].address
    //   tokenContract = new vNode.sharedState.web3.eth.Contract(ERC20_ABI, tokenAddress)

    //   const decimals = token[config.networkId].decimals
    //   return retry3Times(tokenContract.methods.balanceOf(address).call).then(async balance => {
    //     let balanceBNs = new BigNumber(balance).shiftedBy(-decimals)
    //     let maxWithdrawInWei = await retry3Times(
    //       allowTokensContract.methods.calcMaxWithdraw(tokenAddress).call,
    //     )
    //     let maxWithdraw = new BigNumber(
    //       vNode.sharedState.web3.utils.fromWei(maxWithdrawInWei, 'ether'),
    //     )
    //     let maxValue = 0
    //     if (balanceBNs.isGreaterThan(maxWithdraw)) {
    //       maxValue = maxWithdraw
    //     } else {
    //       maxValue = balanceBNs
    //     }
    //     let serviceFee = new BigNumber(maxValue).times(fee)
    //     let value = maxValue.minus(serviceFee).toFixed(decimals, BigNumber.ROUND_DOWN)
    //     $('#amount').val(value.toString())
    //     $('#amount').keyup()
    //   })
    // }

    async function approveSpend() {
      var tokenToCross = $('#tokenAddress').val()
      var token = TOKENS.find(element => element.token == tokenToCross)
      if (!token) {
        crossTokenError('Choose a token to cross')
        return
      }
      const BN = vNode.sharedState.web3.utils.BN
      const amount = $('#amount').val()

      if (!amount) {
        crossTokenError('Complete the Amount field')
        return
      }
      if ($('#amount').hasClass('is-invalid')) {
        crossTokenError('Invalid Amount')
        return
      }

      const amountBN = new BN(
        vNode.sharedState.web3.utils.toWei(Number.MAX_SAFE_INTEGER.toString(), 'ether'),
      )

      let gasPrice = await getGasPriceHex()

      $('#wait').show()

      return new Promise((resolve, reject) => {
        tokenContract.methods
          .approve(bridgeContract.options.address, amountBN.toString())
          .send({ from: address, gasPrice: gasPrice, gas: 70_000 }, async (err, txHash) => {
            if (err) return reject(err)
            try {
              let receipt = await waitForReceipt(txHash)
              if (receipt.status) {
                resolve(receipt)
              }
            } catch (err) {
              reject(err)
            }
            reject(
              new Error(
                `Execution failed <a target="_blank" href="${config.explorer}/tx/${txHash}">see Tx</a>`,
              ),
            )
          })
      })
        .then(() => {
          $('#wait').hide()

          // approve disabled, cross tokens enabled
          disableApproveCross({
            approvalDisable: true,
            doNotAskDisabled: true,
            crossDisabled: false,
          })
        })
        .catch(err => {
          $('#wait').hide()
          console.error(err)
          crossTokenError(`Couldn't approve amount. ${err.message}`)

          // all options disabled:
          disableApproveCross({
            approvalDisable: true,
            doNotAskDisabled: true,
            crossDisabled: true,
          })
        })
    }

    async function crossToken() {
      cleanAlertError()
      cleanAlertSuccess()
      const receiverAddress = $('#receive-address').val()
      if (!receiverAddress) {
        crossTokenError('Choose a Receiver address')
        return
      }
      var tokenToCross = $('#tokenAddress').val()
      var token = TOKENS.find(element => element.token == tokenToCross)
      if (!token) {
        crossTokenError('Choose a token to cross')
        return
      }
      const tokenAddress = token[config.networkId].address
      tokenContract = new vNode.sharedState.web3.eth.Contract(ERC20_ABI, tokenAddress)
      const BN = vNode.sharedState.web3.utils.BN

      const amount = $('#amount').val()
      if (!amount) {
        crossTokenError('Complete the Amount field')
        return
      }
      if ($('#amount').hasClass('is-invalid')) {
        crossTokenError('Invalid Amount')
        return
      }
      const decimals = token[config.networkId].decimals
      const splittedAmount = amount.split('.')
      var amountWithDecimals = splittedAmount[0]
      for (let i = 0; i < decimals; i++) {
        if (splittedAmount[1] && i < splittedAmount[1].length) {
          amountWithDecimals += splittedAmount[1][i]
        } else {
          amountWithDecimals += '0'
        }
      }
      const amountBN = new BN(amountWithDecimals)
        .mul(new BN(feePercentageDivider))
        .div(new BN(feePercentageDivider - feePercentage))

      // disableInputs(true)
      $('.fees').hide()
      $('#secondsPerBlock').text(config.secondsPerBlock)
      $('#wait').show()
      let gasPrice = ''

      return retry3Times(tokenContract.methods.balanceOf(address).call)
        .then(async balance => {
          const balanceBN = new BN(balance)
          if (balanceBN.lt(amountBN)) {
            const showBalance = new BigNumber(balance)
            throw new Error(
              `Insuficient Balance in your account, your current balance is ${showBalance.shiftedBy(
                -decimals,
              )} ${token[config.networkId].symbol}`,
            )
          }
          let maxWithdrawInWei = await retry3Times(
            allowTokensContract.methods.calcMaxWithdraw(tokenAddress).call,
          )
          const maxWithdraw = new BN(maxWithdrawInWei)
          if (amountBN.gt(maxWithdraw)) {
            throw new Error(
              `Amount bigger than the daily limit. Daily limit left ${vNode.sharedState.web3.utils.fromWei(
                maxWithdrawInWei,
                'ether',
              )} tokens`,
            )
          }

          var gasPriceParsed = 0
          if (config.networkId >= 30 && config.networkId <= 33) {
            let block = await vNode.sharedState.web3.eth.getBlock('latest')
            gasPriceParsed = parseInt(block.minimumGasPrice)
            gasPriceParsed = gasPriceParsed <= 1 ? 1 : gasPriceParsed * 1.03
          } else {
            let gasPriceAvg = await vNode.sharedState.web3.eth.getGasPrice()
            gasPriceParsed = parseInt(gasPriceAvg)
            gasPriceParsed = gasPriceParsed <= 1 ? 1 : gasPriceParsed * 1.3
          }
          gasPrice = `0x${Math.ceil(gasPriceParsed).toString(16)}`
        })
        .then(async () => {
          $('#myModal .modal-body').html(
            '<p>When the transaction is mined you will see it like</p>' +
              '<img src="pending-tx.png">' +
              '<p>Once it has enough confirmation you will need to <b>claim it on the other network</b></p>' +
              '<img src="claim-tx.png">',
          )
          $('#myModal').modal('show')
          return new Promise((resolve, reject) => {
            bridgeContract.methods
              .receiveTokensTo(tokenContract.options.address, receiverAddress, amountBN.toString())
              .send({ from: address, gasPrice: gasPrice, gas: 250_000 }, async (err, txHash) => {
                if (err) return reject(err)
                try {
                  let receipt = await waitForReceipt(txHash)

                  disableApproveCross({
                    approvalDisable: true,
                    doNotAskDisabled: true,
                    crossDisabled: true,
                  })

                  if (receipt.status) {
                    resolve(receipt)
                  }
                } catch (err) {
                  reject(err)
                }
                reject(
                  new Error(
                    `Execution failed <a target="_blank" href="${config.explorer}/tx/${txHash}">see Tx</a>`,
                  ),
                )
              })
          })
        })
        .then(async receipt => {
          $('#myModal').modal('hide')
          $('#wait').hide()
          $('#confirmationTime').text(config.confirmationTime)
          $('#receive').text(`${amount} ${token[config.crossToNetwork.networkId].symbol}`)
          $('#success').show()
          // disableInputs(false)

          // save transaction to local storage...
          TXN_Storage.addTxn(address, config.name, {
            networkId: config.networkId,
            tokenFrom: token[config.networkId].symbol,
            tokenTo: token[config.crossToNetwork.networkId].symbol,
            amount,
            receiverAddress,
            ...receipt,
          })

          updateActiveAddressTXNs(address)
          showActiveTxnsTab()
          showActiveAddressTXNs()
        })
        .catch(err => {
          $('#wait').hide()
          console.error(err)
          crossTokenError(`Couln't cross the tokens. ${err.message}`)
        })
    }

    async function getGasPriceHex() {
      var gasPriceParsed = 0
      if (config.networkId >= 30 && config.networkId <= 33) {
        let block = await vNode.sharedState.web3.eth.getBlock('latest')
        gasPriceParsed = parseInt(block.minimumGasPrice)
        gasPriceParsed = gasPriceParsed <= 1 ? 1 : gasPriceParsed * 1.03
      } else {
        let gasPriceAvg = await vNode.sharedState.web3.eth.getGasPrice()
        gasPriceParsed = parseInt(gasPriceAvg)
        gasPriceParsed = gasPriceParsed <= 1 ? 1 : gasPriceParsed * 1.3
      }
      return `0x${Math.ceil(gasPriceParsed).toString(16)}`
    }

    async function claim(txn, currentTarget) {
      const sideWeb3 = new Web3(config.crossToNetwork.rpc)
      const receipt = await sideWeb3.eth.getTransactionReceipt(txn.transactionHash)
      const eventJsonInterface = BRIDGE_ABI.find(x => x.name === 'Cross' && x.type === 'event')
      const eventSignature = sideWeb3.eth.abi.encodeEventSignature(eventJsonInterface)
      const event = receipt.logs.find(x => x.topics[0] === eventSignature)
      event.topics.shift()
      const decodedEvent = sideWeb3.eth.abi.decodeLog(
        eventJsonInterface.inputs,
        event.data,
        event.topics,
      )

      let gasPrice = await getGasPriceHex()
      currentTarget.disabled = true
      currentTarget.innerHTML =
        '<span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span><span class="sr-only">Loading...</span>'

      return new Promise((resolve, reject) => {
        bridgeContract.methods
          .claim({
            to: decodedEvent._to,
            amount: decodedEvent._amount,
            blockHash: event.blockHash,
            transactionHash: event.transactionHash,
            logIndex: event.logIndex,
          })
          .send({ from: address, gasPrice: gasPrice, gas: 250_000 }, async (err, txHash) => {
            if (err) return reject(err)
            try {
              let receipt = await waitForReceipt(txHash)
              if (receipt.status) {
                resolve(receipt)
              }
            } catch (err) {
              reject(err)
            }
            reject(
              new Error(
                `Execution failed <a target="_blank" href="${config.explorer}/tx/${txHash}">see Tx</a>`,
              ),
            )
          })
      })
        .then(() => {
          currentTarget.disabled = false
          currentTarget.parentElement.outerHTML = '<span class="confirmed"> Claimed</span>'
        })
        .catch(err => {
          currentTarget.disabled = false
          currentTarget.innerHTML = 'Claim'
          console.error(err)
          crossTokenError(`Couldn't Claim. ${err.message}`)
        })
    }

    function cleanAlertSuccess() {
      $('#success').hide()
    }

    function cleanAlertError() {
      $('#alert-danger-text').html('')
      $('#alert-danger').hide()
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
      cleanAlertSuccess()
      let amount = $('#amount').val()
      if (amount == '') {
        markInvalidAmount('Invalid amount')
        return
      }
      let parsedAmount = new BigNumber(amount)
      if (parsedAmount <= 0) {
        markInvalidAmount('Must be bigger than 0')
        return
      }
      $('#secondsPerBlock').text(config.secondsPerBlock)
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
          $('.approve-deposit').hide()
          // straight to convert

          const crossDisabled = true //isReceiverAddressOk()
          disableApproveCross({
            approvalDisable: true,
            doNotAskDisabled: true,
            crossDisabled: !crossDisabled,
          })
          $('.fees').show()
        } else {
          // user must first approve amount
          disableApproveCross({
            approvalDisable: false,
            doNotAskDisabled: false,
            crossDisabled: true,
          })
          $('.approve-deposit').show()
        }
      }
    }

    // async function isReceiverAddressOk() {
    //   const receiverAddress = $('#receive-address').val()
    //   if (receiverAddress == '' || !isAddress(receiverAddress)) {
    //     markInvalidReceiverAddress('Invalid Receiver Address')

    //     disableApproveCross({
    //       approvalDisable: null,
    //       doNotAskDisabled: true,
    //       crossDisabled: true,
    //     })

    //     return false
    //   }
    //   $('.receive-address .invalid-feedback').hide()
    //   $('#receive-address').removeClass('is-invalid')
    //   $('#receive-address').addClass('ok')
    //   $('.fees').show()
    //   return true
    // }

    async function isAmountOk() {
      cleanAlertSuccess()
      let amount = $('#amount').val()
      if (amount == '') {
        markInvalidAmount('Invalid amount')

        disableApproveCross({
          approvalDisable: true,
          doNotAskDisabled: true,
          crossDisabled: true,
        })

        return
      }
      let parsedAmount = new BigNumber(amount)
      if (parsedAmount <= 0) {
        markInvalidAmount('Must be bigger than 0')

        disableApproveCross({
          approvalDisable: true,
          doNotAskDisabled: true,
          crossDisabled: true,
        })

        return
      }
      $('#amount').removeClass('ok')
      let totalCost = fee == 0 ? parsedAmount : parsedAmount.dividedBy(1 - fee)
      let serviceFee = totalCost.times(fee)

      $('#serviceFee').html(serviceFee.toFormat(6, BigNumber.ROUND_DOWN))
      $('#totalCost').html(totalCost.toFormat(6, BigNumber.ROUND_DOWN))
      try {
        if (totalCost < minTokensAllowed) {
          throw new Error(`Minimum amount ${minTokensAllowed - minTokensAllowed * fee} token`)
        }
        if (totalCost > maxTokensAllowed) {
          throw new Error(`Max amount ${maxTokensAllowed - maxTokensAllowed * fee} tokens`)
        }

        $('.amount .invalid-feedback').hide()
        $('#amount').removeClass('is-invalid')
        $('#amount').addClass('ok')
        $('.fees').show()
        $('#receive-amount').val(parseInt(amount, 10) * 0.998)
      } catch (err) {
        disableApproveCross({
          approvalDisable: true,
          doNotAskDisabled: true,
          crossDisabled: true,
        })

        markInvalidAmount(err.message)
      }
    }

    function markInvalidReceiverAddress(errorDescription) {
      let invalidReceiverAddress = $('.receiverAddress .invalid-feedback')
      invalidReceiverAddress.html(errorDescription)
      invalidReceiverAddress.show()
      $('#receive-address').addClass('is-invalid')
      $('#receive-address').prop('disabled', false)
      $('#receive-address').removeClass('ok')
      $('.fees').hide()
    }

    function markInvalidAmount(errorDescription) {
      let invalidAmount = $('.amount .invalid-feedback')
      invalidAmount.html(errorDescription)
      invalidAmount.show()
      $('#amount').addClass('is-invalid')
      $('#amount').prop('disabled', false)
      $('#amount').removeClass('ok')
      $('.fees').hide()
    }

    async function isInstalled() {
      if (window.ethereum) {
        window.ethereum.autoRefreshOnNetworkChange = false
      }

      await vNode.handleLogin()

      let accounts = await getAccounts()
      let chainId = await vNode.sharedState.web3.eth.net.getId()
      await updateCallback(chainId, accounts)

      vNode.sharedState.provider.on('chainChanged', function(newChain) {
        updateNetwork(newChain)
        showActiveTxnsTab()
      })
      vNode.sharedState.provider.on('accountsChanged', function(newAddresses) {
        checkAllowance()
        updateAddress(newAddresses)
          .then(addr => updateActiveAddressTXNs(addr))
          .then(() => showActiveAddressTXNs())
      })
      return chainId
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
      allowTokensContract = null
      bridgeContract = null
      config = null
      address = ''
    }

    function disableApproveCross({
      approvalDisable = true,
      doNotAskDisabled = true,
      crossDisabled = true,
    }) {
      if (approvalDisable !== null) {
        $('#approve').prop('disabled', approvalDisable)
      }
      $('#doNotAskAgain').prop('disabled', doNotAskDisabled)
      $('#deposit').prop('disabled', crossDisabled)
    }

    // function disableInputs(disable) {
    //   $('#tokenAddress').prop('disabled', disable)
    //   $("button[data-id='tokenAddress']").prop('disabled', disable)
    //   $('#amount').prop('disabled', disable)
    //   if (disable) {
    //     $('#max').off('click')
    //     $('#max').removeAttr('href')
    //   } else {
    //     $('#max').on('click', getMaxBalance)
    //     $('#max').attr('href', '#')
    //   }
    // }

    function onMetaMaskConnectionSuccess() {
      // disableInputs(false)
      disableApproveCross({
        approvalDisable: true,
        doNotAskDisabled: true,
        crossDisabled: true,
      })
    }

    function updateAddress(newAddresses) {
      address = newAddresses[0]
      $('#address').text(address)
      $('#logIn').hide()
      $('#transferTab').removeClass('disabled')
      $('#help').show()
      $('.wallet-status').show()

      return Promise.resolve(address)
    }

    function updateActiveAddressTXNs(addr) {
      if (config.name.toLowerCase().includes('eth')) {
        activeAddressEth2RskTxns = TXN_Storage.getAllTxns4Address(addr, config.name)
        activeAddressRsk2EthTxns = TXN_Storage.getAllTxns4Address(addr, config.crossToNetwork.name)
      } else {
        activeAddressRsk2EthTxns = TXN_Storage.getAllTxns4Address(addr, config.name)
        activeAddressEth2RskTxns = TXN_Storage.getAllTxns4Address(addr, config.crossToNetwork.name)
      }
    }

    function showActiveTxnsTab() {
      if (config.name.toLowerCase().includes('eth')) {
        $('#nav-eth-rsk-tab')
          .addClass('active')
          .attr('aria-selected', true)

        $('#nav-eth-rsk').addClass('active show')

        $('#nav-rsk-eth-tab')
          .removeClass('active')
          .attr('aria-selected', false)

        $('#nav-rsk-eth').removeClass('active show')
      } else {
        $('#nav-rsk-eth-tab')
          .addClass('active')
          .attr('aria-selected', true)

        $('#nav-rsk-eth').addClass('active show')

        $('#nav-eth-rsk-tab')
          .attr('aria-selected', false)
          .removeClass('active')

        $('#nav-eth-rsk').removeClass('active show')
      }
    }

    async function showActiveAddressTXNs() {
      if (!address || (!activeAddressEth2RskTxns.length && !activeAddressRsk2EthTxns.length)) {
        $('#previousTxnsEmptyTab')
          .css('margin-bottom', '6em')
          .show()
        $('#previousTxnsTab').hide()
        return
      }

      $('#previousTxnsEmptyTab')
        .css('margin-bottom', '0em')
        .hide()
      $('#previousTxnsTab')
        .show()
        .css('margin-bottom', '6em')
      $('#txn-previous')
        .off()
        .on('click', onPreviousTxnClick)
      $('#txn-next')
        .off()
        .on('click', onNextTxnClick)

      let eth2RskTable = $('#eth-rsk-tbody')
      let rsk2EthTable = $('#rsk-eth-tbody')

      eth2RskPaginationObj = Paginator(activeAddressEth2RskTxns, eth2RskTablePage, 3)
      let { data: eth2RskTxns } = eth2RskPaginationObj

      rsk2EthPaginationObj = Paginator(activeAddressRsk2EthTxns, rsk2EthTablePage, 3)
      let { data: rsk2EthTxns } = rsk2EthPaginationObj

      const processTxn = async (txn, networkConfig, blockNumber, sideWeb3) => {
        const { confirmations, secondsPerBlock, explorer } = networkConfig

        let elapsedBlocks = blockNumber - txn.blockNumber
        let remainingBlocks2Confirmation = confirmations - elapsedBlocks
        let status = 'Info Not Available'
        if (txn.blockNumber > networkConfig.v2UpdateBlock) {
          // V2 Protocol
          const sideBridgeContract = new sideWeb3.eth.Contract(
            BRIDGE_ABI,
            networkConfig.crossToNetwork.bridge,
          )
          const txDataHash = await sideBridgeContract.methods
            .transactionsDataHashes(txn.transactionHash)
            .call()
          if (txDataHash === NULL_HASH) status = '<span class="pending"> Pending</span>'
          else {
            const claimed = await sideBridgeContract.methods.claimed(txDataHash).call()
            if (claimed) {
              status = '<span class="confirmed"> Claimed</span>'
            } else {
              status = '<span><button class="btn btn-primary claim">Claim</button></span>'
            }
          }
        } else {
          // V1 Protocol
          status =
            elapsedBlocks >= confirmations
              ? `<span class="confirmed"> Confirmed</span>`
              : `<span class="pending"> Pending</span>`
        }

        let seconds2Confirmation =
          remainingBlocks2Confirmation > 0 ? remainingBlocks2Confirmation * secondsPerBlock : 0

        let hoursToConfirmation = Math.floor(seconds2Confirmation / 60 / 60)
        let hoursToConfirmationStr = hoursToConfirmation > 0 ? `${hoursToConfirmation}hs ` : ''
        let minutesToConfirmation = Math.floor(seconds2Confirmation / 60) - hoursToConfirmation * 60
        let humanTimeToConfirmation =
          elapsedBlocks < confirmations
            ? `| ~ ${hoursToConfirmationStr} ${minutesToConfirmation}mins`
            : ''

        let txnExplorerLink = `${explorer}/tx/${txn.transactionHash}`
        let shortTxnHash = `${txn.transactionHash.substring(0, 8)}...${txn.transactionHash.slice(
          -8,
        )}`

        let htmlRow = `<tr class="black">
                <th scope="row"><a class="confirmed" href="${txnExplorerLink}">${shortTxnHash}</a></th>
                <td>${txn.blockNumber}</td>
                <td>${txn.amount} ${txn.tokenFrom}</td>
                <td>${status} ${humanTimeToConfirmation}</td>
            </tr>`

        return htmlRow
      }

      let rskConfig = config
      let ethConfig = config.crossToNetwork
      let rskWeb3 = vNode.sharedState.web3
      let ethWeb3 = new Web3(config.crossToNetwork.rpc)
      let rskBlockNumber = currentBlockNumber
      let ethBlockNumber = await ethWeb3.eth.getBlockNumber()
      if (config.name.toLowerCase().includes('eth')) {
        rskConfig = config.crossToNetwork
        ethConfig = config
        rskWeb3 = new Web3(config.crossToNetwork.rpc)
        ethWeb3 = vNode.sharedState.web3
        rskBlockNumber = await rskWeb3.eth.getBlockNumber()
        ethBlockNumber = currentBlockNumber
      }
      const activeAddressTXNsEth2RskRowsPromises = Promise.all(
        eth2RskTxns.map(txn => {
          return processTxn(txn, ethConfig, ethBlockNumber, rskWeb3)
        }),
      )
      const activeAddressTXNsRsk2EthRowsPromises = Promise.all(
        rsk2EthTxns.map(txn => {
          return processTxn(txn, rskConfig, rskBlockNumber, ethWeb3)
        }),
      )

      const activeAddressTXNsEth2RskRows = await activeAddressTXNsEth2RskRowsPromises
      const activeAddressTXNsRsk2EthRows = await activeAddressTXNsRsk2EthRowsPromises
      eth2RskTable.html(activeAddressTXNsEth2RskRows.join())
      rsk2EthTable.html(activeAddressTXNsRsk2EthRows.join())
    }

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
      cleanAlertSuccess()
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
        allowTokensContract = new vNode.sharedState.web3.eth.Contract(
          ALLOW_TOKENS_ABI,
          config.allowTokens,
        )
        bridgeContract = new vNode.sharedState.web3.eth.Contract(BRIDGE_ABI, config.bridge)
        federationContract = new vNode.sharedState.web3.eth.Contract(
          FEDERATION_ABI,
          config.federation,
        )

        $('#myModal').modal('hide')
        updateNetworkConfig(config)
        // updateTokenAddressDropdown(config.networkId)

        onMetaMaskConnectionSuccess()

        await poll4LastBlockNumber(vNode.sharedState.web3, function(blockNumber) {
          currentBlockNumber = blockNumber
          showActiveAddressTXNs()
        })

        if (TXN_Storage.isStorageAvailable('localStorage')) {
          console.log(`Local Storage Available!`)
        } else {
          console.log(`Local Storage Unavailable!`)
        }
      } catch (err) {
        onMetaMaskConnectionError(err)
        throw err
      }
    }

    // function updateTokenAddressDropdown(networkId) {
    //   let selectHtml = ''
    //   for (let aToken of TOKENS) {
    //     if (aToken[networkId] != undefined) {
    //       selectHtml += `\n<option value="${aToken.token}" `
    //       selectHtml += `data-content="<span><img src='${aToken.icon}' class='token-logo'></span>${aToken[networkId].symbol}">`
    //       selectHtml += `\n</option>`
    //     }
    //   }
    //   $('#tokenAddress').html(selectHtml)
    //   $('#tokenAddress').prop('disabled', false)
    //   $('#tokenAddress').selectpicker('refresh')
    //   $('#willReceiveToken').html('-')
    // }

    async function getAccounts() {
      let accounts = await vNode.sharedState.web3.eth.getAccounts()
      if (accounts.length === 0)
        throw new Error(
          'Nifty Wallet or MetaMask is Locked, please unlock it and Reload the page to continue',
        )
      return accounts
    }
  },
  methods: {
    handleLogin() {
      return store.handleLogin()
    },
  },
}
</script>
