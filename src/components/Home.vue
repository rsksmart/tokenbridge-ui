<template>
<div>
    <div id="main">
      <!-- Navigation -->
      <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
          <div class="container">
              <a class="navbar-brand" href="https://rsk.co">
                  <img id="logo" src="https://developers.rsk.co/assets/img/rsk_logo.svg" class="logo" alt="RSK Token Bridge">
              </a>
              <div class="wallet-status navbar-item indicator badge-outline badge-pill" style="display: none;">
                  <span aria-describedby="tooltip-status" class="fromNetwork">Network</span>
              </div>
              <button class="navbar-toggler collapsed" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
                  <span class="navbar-toggler-icon"></span>
              </button>
              <div class="navbar-collapse collapse" id="navbarResponsive">
                  <div class="wallet-status navbar-item badge-pill text-truncate" style="width: 85px; display: none;">
                      <span id="address">0x123456789</span>
                  </div>
                  <div class="navbar-item ml-auto" >
                      <button id="logIn" type="button" class="btn btn-primary badge-pill">
                          Connect wallet
                      </button>
                      <a id="help" href="https://developers.rsk.co/slack/" style="display: none;">
                          Do you need help?
                      </a>
                  </div>
              </div>
          </div>
      </nav>
      <section id="home">
        <div class="container">
          <Title :isTestnet="isTestnet" />
          <CrossFormHorizontal />
          <!--<CrossForm />-->

          <div id="previousTxnsEmptyTab">
              <h5 class="subtitle">Active account transactions</h5>
              <p class="text-center">Please note that all transactions listed here will not
                      appear if you use another device</p>
              <h5 class="subtitle">No transactions for active account found</h5>
          </div>

          <div id="previousTxnsTab">
              <h5 class="subtitle">Active account transactions</h5>
              <nav>
                  <div class="nav nav-tabs" id="nav-tab" role="tablist">
                      <a class="nav-item nav-link active" id="nav-rsk-eth-tab" data-toggle="tab" href="#nav-rsk-eth" role="tab" aria-controls="nav-rsk-eth" aria-selected="true">RSK -> ETH</a>
                      <a class="nav-item nav-link" id="nav-eth-rsk-tab" data-toggle="tab" href="#nav-eth-rsk" role="tab" aria-controls="nav-eth-rsk" aria-selected="false">ETH -> RSK</a>
                  </div>
              </nav>
                  <div class="tab-content" id="nav-tabContent">
                      <div class="tab-pane fade show active" id="nav-rsk-eth" role="tabpanel" aria-labelledby="nav-rsk-eth-tab">
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
                      <div class="tab-pane fade" id="nav-eth-rsk" role="tabpanel" aria-labelledby="nav-eth-rsk-tab">
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
                        <button type="button" id="txn-previous" class="btn btn-secondary">&lt; previous</button>
                        <button type="button" id="txn-next" class="btn btn-secondary">next ></button>
                      </div>
                  </div>
          </div>

          <ImportantDetails />

          <TokensBridgeList />

      </div> <!--- End Tab Content -->
    </section>
  </div>
  <!-- Modal -->
  <div id="myModal" class="modal fade" tabindex="-1" role="dialog">
      <div class="modal-dialog modal-dialog-centered" role="document">
          <div class="modal-content">
              <div class="modal-header">
                  <h5 class="modal-title">Connect wallet</h5>
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                  </button>
              </div>
              <div class="modal-body">
              </div>
          </div>
      </div>
  </div>
  <footer id="footer" class="section-bg">
      <div class="footer-top">
      <div class="container">
          <div class="row">
            <div class="col-lg-12">
                <img src="https://www.rsk.co/img/powered_by_iov.svg" class="img-fluid powered_by">
            </div>
          </div>
          <div class="row">
            <div class="col-lg-6">
                <div class="row">
                  <div class="col-sm-7">
                      <div class="footer-info">
                        <p>Rsk is the most secure smart contract network in the world and enables decentralized applications secured by the Bitcoin Network to empower people and improve the quality of life of millions.</p>
                        <br/>
                        <a href="https://developers.rsk.co/" rel="nofollow noopener noreferrer" target="_blank" class="footer-button rounded" title="Start now">Start now</a>
                      </div>
                  </div>
                  <div class="col-sm-5"></div>
                </div>
            </div>
            <div class="col-lg-6">
                <div class="row">
                  <div class="col-md-6">
                      <div class="footer-links">
                        <ul>
                            <li><a href="https://developers.rsk.co/tools/tokenbridge/dappguide" target="_blank">How to use it?</a></li>
                            <li><a href="https://developers.rsk.co/tools/tokenbridge/faq/">FAQ</a></li>
                            <li><a href="https://github.com/rsksmart/tokenbridge" target="_blank">Repository</a></li>
                            <li><a id="get-rbtc-navlink" href="https://coinswitch.rsk.co/" target="_blank">Get RBTC</a></li>
                            <li><a id="network-navlink" href="https://testnet.tokenbridge.rsk.co">Use Testnet</a></li>
                            <li><a href="https://developers.rsk.co/tools/tokenbridge" rel="nofollow noopener noreferrer" target="_blank" class="footer-button" title="Documentation">Documentation</a></li>    
                        </ul>
                      </div>
                  </div>
                  <div class="col-md-6">
                      <div class="footer-links">
                        <ul>
                          <li><a href="https://www.iovlabs.org" rel="nofollow noopener noreferrer" target="_blank">About IOVlabs</a></li>
                          <li><a href="https://www.iovlabs.org/contact.html" rel="nofollow noopener noreferrer" target="_blank">Contact IOVlabs</a></li>
                          <li><a href="https://blog.rsk.co/" rel="nofollow noopener noreferrer" target="_blank">Blog</a></li>
                          <li><a class="bold" href="https://www.rsk.co/Brand_Guidelines/RSK_BrandManual_V6.pdf" rel="nofollow noopener noreferrer" target="_blank">Brand Guidelines</a></li>
                          <li><a class="bold" href="https://www.rsk.co/terms-conditions">Terms &amp; Conditions</a></li>
                          <li><a class="bold mb-30" href="https://www.rsk.co/privacy-policy">Privacy Policy</a></li>
                        </ul>
                      </div>
                  </div>
                </div>
                <div class="social-links">
                  <a href="https://twitter.com/rsksmart" rel="nofollow noopener noreferrer" target="_blank" class="twitter"><i class="fab fa-twitter"></i></a>
                  <a href="https://www.youtube.com/rsksmart" rel="nofollow noopener noreferrer" target="_blank" class="facebook"><i class="fab fa-youtube"></i></a>
                  <a href=" https://www.facebook.com/RSKsmart/" rel="nofollow noopener noreferrer" target="_blank" class="linkedin"><i class="fab fa-facebook"></i></a>
                  <a href="https://gitter.im/rsksmart" rel="nofollow noopener noreferrer" target="_blank" class="instagram"><i class="fab fa-gitter"></i></a>
                  <a href="https://www.reddit.com/r/rootstock/" rel="nofollow noopener noreferrer" target="_blank" class="instagram"><i class="fab fa-reddit"></i></a>
                  <a href="https://t.me/rskofficialcommunity" rel="nofollow noopener noreferrer" target="_blank" class="instagram"><i class="fab fa-telegram"></i></a>
                  <a href="https://medium.com/@RSKNews" rel="nofollow noopener noreferrer" target="_blank" class="instagram"><i class="fab fa-medium"></i></a>
                  <a href="https://t.me/rsksmartcontract" rel="nofollow noopener noreferrer" target="_blank" class="instagram"><i class="fab fa-telegram"></i></a>
                  <a href="https://www.instagram.com/rsksmart/" rel="nofollow noopener noreferrer" target="_blank" class=""><i class="fab fa-instagram"></i></a>
                  <a href="https://bitcointalk.org/index.php?topic=5124334" rel="nofollow noopener noreferrer" target="_blank" class=""><i class="fab fa-btc"></i></a>
                </div>
            </div>
          </div>
      </div>
      <div class="container">
          <div class="col-md-12">
            <div class="row">
                <div class="col-md-6 col-xs-12 pl-0-mobile">
                  <p class="copyright">Copyright © 2015 RSK Labs. All rights reserved.</p>
                </div>
                <div class="col-md-6 col-xs-12 pl-0-mobile">
                  <p class="credits"> RSK Public Key (69F6 F997 2497 8762 D541 8AE4 58D2 260D 5998 6758)</p>
                </div>
            </div>
          </div>
      </div>
    </div>
  </footer>
</div>
</template>

<script>
// --------- TOKENS import TOKENS variable  --------------
import {
    TOKENS,
    KOVAN_CONFIG,
    RSK_TESTNET_CONFIG,
    ETH_CONFIG,
    RSK_MAINNET_CONFIG,
} from '@/constants'

// ------ ABIS -----
import BRIDGE_ABI from './abis/bridge.json'
import ALLOW_TOKENS_ABI from './abis/allowTokens.json'
import ERC20_ABI from './abis/erc20.json'
import FEDERATION_ABI from './abis/federation.json'

// external js packages
import BigNumber from 'bignumber.js'
import Web3 from 'web3'
import RLogin from '@rsksmart/rlogin'
import WalletConnectProvider from '@walletconnect/web3-provider'

import $ from 'jquery'
import 'popper.js'
import 'bootstrap'
import 'bootstrap-select'
import ClipboardJS from 'clipboard'

import {
  Paginator,
  retry3Times,
  poll4LastBlockNumber,
  NULL_HASH,
  TXN_Storage,
} from '@/utils';

import CrossFormHorizontal from '@/components/crossFormHorizontal/CrossFormHorizontal.vue'
import Title from '@/components/title/Title.vue'
import ImportantDetails from '@/components/importantDetails/ImportantDetails.vue'
import TokensBridgeList from '@/components/tokensBridgeList/TokensBridgeList.vue'

export default {
  name: 'Home',
  components: {
    Title,
    CrossFormHorizontal,
    ImportantDetails,
    TokensBridgeList
  },
  data() {
    return {
      isTestnet: false
    }
  },
  created() {

    //User
    let address = '';
    let activeAddressEth2RskTxns = [];
    let eth2RskTablePage = 1;
    let eth2RskPaginationObj = {};
    let activeAddressRsk2EthTxns = [];
    let rsk2EthTablePage = 1;
    let rsk2EthPaginationObj = {};

    //Network configuration
    let config = null;
    let isTestnet = true;
    let allowTokensContract = null;
    let bridgeContract = null;
    let federationContract = null;
    let minTokensAllowed = 1;
    let maxTokensAllowed = 100_000;
    let maxDailyLimit = 1_000_000;
    let currentBlockNumber = null;

    // Selected Token To Cross
    let tokenContract = null;
    let feePercentage = 0;
    let fee = 0;
    let feePercentageDivider = 10_000;
    let rLogin;

    $(document).ready(function() {
        new ClipboardJS('.copy');
        $('[data-toggle="tooltip"]').tooltip();
        $('.selectpicker').selectpicker();

        isTestnet = window.location.href.includes('testnet');
        if(isTestnet) {
            $('#title').text('RSK Testnet bridges with Ethereum Kovan');
            let navlink = $('#network-navlink');
            navlink.prop('href', 'https://tokenbridge.rsk.co');
            navlink.text('Use Mainnet');
            navlink = $('#get-rbtc-navlink');
            navlink.prop('href', 'https://faucet.rsk.co/');
        }

        if(!/chrom(e|ium)/.test(navigator.userAgent.toLowerCase())
            && navigator.userAgent.indexOf("Firefox") == -1 ) {
            alert('This site will only work correctly under chrome, chromium or firefox');
        }

        disableInputs(true);
        disableApproveCross({
            approvalDisable: true,
            doNotAskDisabled: true,
            crossDisabled: true
        });

        $('#logIn').on('click', onLogInClick);

        let rpc = {
            1: `https://mainnet.infura.io/v3/${process.env.VUE_APP_INFURA_KEY}`,
            30: 'https://public-node.rsk.co',
        };
        let supportedChains = [1,30];
        if(isTestnet) {
            rpc = {
                42: `https://kovan.infura.io/v3/${process.env.VUE_APP_INFURA_KEY}`,
                31: 'https://public-node.testnet.rsk.co',
            };
            supportedChains = [42,31];
        }
        rLogin = new RLogin({
                cachedProvider: false,
                providerOptions: {
                    walletconnect: {
                    package: WalletConnectProvider,
                    options: {
                        rpc: rpc
                    }
                }
            },
            supportedChains: supportedChains
        });

        $('#tokenAddress').change(function(event) {
            cleanAlertSuccess();
            let token = TOKENS.find(element => element.token == event.currentTarget.value);
            if(token) {
                $('.selectedToken').html(token[config.networkId].symbol);
                let html = `<a target="_blank" href="${config.crossToNetwork.explorer}/address/${token[config.crossToNetwork.networkId].address.toLowerCase()}">`;
                html += `\n   <span><img src="${token.icon}" class="token-logo"></span>${token[config.crossToNetwork.networkId].symbol}`;
                html += `\n </a>`
                $('#willReceiveToken').html(html);
                $('#willReceive-copy').show();
                $('#willReceive-copy').attr('data-clipboard-text', token[config.crossToNetwork.networkId].address);
                if($('#amount').val()) {
                    isAmountOk();
                    checkAllowance();
                }
            } else {
                $('.selectedToken').html('');
                $('#willReceive').html('');
                $('#willReceive-copy').hide();
            }
        });

        $('#amount').keyup(function(event) {
            isAmountOk();
            if (event.key === 'Enter') {
                checkAllowance();
            }
        });
        $('#amount').focusout(checkAllowance)
        $('#amount').keypress(function(event) {
            if(event.key !== '.' && (event.key < '0' || event.key > '9')) {
                return false;
            }
        });
        $('#crossForm').on('submit', function(e) {
            e.preventDefault();
            crossToken();
        });

        $('#approve').on('click', function(e) {
            e.preventDefault();
            approveSpend();
        });

        $('.table').on('click', '.claim', function(e) {
            e.preventDefault();
            const url = e.currentTarget.closest('tr').querySelector('.confirmed').href;
            const txHash = url.slice(url.indexOf('tx/') + 3);

            let txn;
            if(config.name.toLowerCase().includes('eth')) {
                txn = activeAddressRsk2EthTxns.find(x => x.transactionHash === txHash);
            } else {
                txn = activeAddressEth2RskTxns.find(x => x.transactionHash === txHash);
            }
            if(!txn) {
                alert('You need to switch the network to claim this');
                return;
            }
            claim(txn, e.currentTarget);
        });

        $('#changeNetwork').on('click', function() {
            if(config) {
                var connectToNetwork = '';
                if(isTestnet) {
                    if(config.crossToNetwork.networkId == 42) {
                        connectToNetwork = 'Ethereum Kovan';
                    } else {
                        connectToNetwork = 'RSK Testnet';
                    }
                } else {
                    if(config.crossToNetwork.networkId == 1) {
                        connectToNetwork = 'Ethereum Mainnet';
                    } else {
                        connectToNetwork = 'RSK Mainnet';
                    }
                }
                updateNetworkConfig(config.crossToNetwork);
                var err = new Error(`Switch the Network.<br /> Please connect your wallet to <b>${connectToNetwork}</b>`);
                onMetaMaskConnectionError(err);
            }
        });
        updateTokenListTab();
        // isInstalled(); - uncomment to show popup on page load
    });

    async function waitForReceipt(txHash) {
        let timeElapsed = 0;
        let interval = 10_000;
        return new Promise((resolve, reject) => {
            const checkInterval = setInterval(async () => {
                timeElapsed += interval;
                let receipt = await web3.eth.getTransactionReceipt(txHash);
                if(receipt != null) {
                    clearInterval(checkInterval);
                    resolve(receipt);
                }
                if(timeElapsed > 90_000) {
                    reject(new Error(`Operation took too long <a target="_blank" href="${config.explorer}/tx/${txHash}">check Tx on the explorer</a>`));
                }
            }, interval);
        });
    }

    function onLogInClick() {
        if(!config) {
            $('#logIn').html('<i class="fas fa-sync fa-spin">');
            $('#logIn').off('click');
            isInstalled()
            .catch( (err) => {
                onMetaMaskConnectionError(typeof err === 'string' ? { message: err } : err);
            });
        }
    }

    function onPreviousTxnClick() {
        if($('#nav-eth-rsk-tab').attr('class').includes('active')) {
            if (eth2RskPaginationObj != {} && eth2RskPaginationObj.pre_page == null) {
                // no decrement applied
            } else {
                eth2RskTablePage -= 1;
            }
        } else {
            if (rsk2EthPaginationObj != {} && rsk2EthPaginationObj.pre_page == null) {
                // no decrement applied
            } else {
                rsk2EthTablePage -= 1;
            }
        }
        showActiveAddressTXNs();
    }

    function onNextTxnClick() {

        if($('#nav-eth-rsk-tab').attr('class').includes('active')) {
            if (eth2RskPaginationObj != {} && eth2RskPaginationObj.next_page == null) {
                // no increment applied
            } else {
                eth2RskTablePage += 1;
            }
        } else {
            if (rsk2EthPaginationObj != {} && rsk2EthPaginationObj.next_page == null) {
                // no increment applied
            } else {
                rsk2EthTablePage += 1;
            }
        }

        showActiveAddressTXNs();
    }

    async function setInfoTab() {
    try {

        //Harcoded values that don't change often to reduce load on the public server
        minTokensAllowed = 1;
        maxTokensAllowed = 10_000;
        maxDailyLimit = 100_000;
        feePercentage = await retry3Times(bridgeContract.methods.getFeePercentage().call);
        fee = feePercentage/feePercentageDivider;
        let feeFormated = (fee*100).toFixed(2) + '%';
        let federators = await retry3Times(federationContract.methods.getMembers().call);

        $('#fee').html(feeFormated);
        $('#config-fee').text(feeFormated);
        $('#config-min').text(minTokensAllowed.toLocaleString());
        $('#config-max').text(maxTokensAllowed.toLocaleString());
        $('#config-to-spend').text(maxDailyLimit.toLocaleString());
        $('#config-federators-count').text(`${federators.length}`);
        //$('#config-federators-required').text(`${Math.floor((federators.length / 2) + 1)}`);
        $('#config-whitelisted-enabled').html(`${config.crossToNetwork.confirmationTime}`);
    } catch (err) {
        console.error('Error setting info tab ', err);
    }
    }

    async function getMaxBalance(event) {
        if(event)
            event.preventDefault();
        let tokenToCross = $('#tokenAddress').val();
        let token = TOKENS.find(element => element.token == tokenToCross);
        if(!token) {
            return;
        }
        const tokenAddress = token[config.networkId].address;
        tokenContract = new web3.eth.Contract(ERC20_ABI, tokenAddress);

        const decimals = token[config.networkId].decimals;
        return retry3Times(tokenContract.methods.balanceOf(address).call)
        .then(async (balance) => {
            let balanceBNs = new BigNumber(balance).shiftedBy(-decimals);
            let maxWithdrawInWei = await retry3Times(allowTokensContract.methods.calcMaxWithdraw(tokenAddress).call);
            let maxWithdraw = new BigNumber(web3.utils.fromWei(maxWithdrawInWei, 'ether'));
            let maxValue = 0;
            if( balanceBNs.isGreaterThan(maxWithdraw)) {
                maxValue = maxWithdraw;
            } else {
                maxValue = balanceBNs;
            }
            let serviceFee = new BigNumber(maxValue).times(fee);
            let value = maxValue.minus(serviceFee).toFixed(decimals, BigNumber.ROUND_DOWN);
            $('#amount').val(value.toString());
            $('#amount').keyup();
        });
    }

    async function approveSpend() {

        var tokenToCross = $('#tokenAddress').val();
        var token = TOKENS.find(element => element.token == tokenToCross);
        if(!token) {
            crossTokenError('Choose a token to cross');
            return;
        }
        const BN = web3.utils.BN;
        const amount = $('#amount').val();

        if(!amount) {
            crossTokenError('Complete the Amount field');
            return;
        }
        if($('#amount').hasClass('is-invalid')) {
            crossTokenError('Invalid Amount');
            return;
        }

        const amountBN = new BN(web3.utils.toWei(Number.MAX_SAFE_INTEGER.toString(), 'ether'));

        let gasPrice = await getGasPriceHex();

        $('#wait').show();

        return new Promise((resolve, reject) => {

            tokenContract.methods.approve(bridgeContract.options.address, amountBN.toString())
                .send({from: address, gasPrice: gasPrice, gas: 70_000}, async (err, txHash) => {
                if (err) return reject(err);
                    try {
                    let receipt = await waitForReceipt(txHash);
                    if(receipt.status) {
                        resolve(receipt);
                    }
                } catch(err) {
                    reject(err);
                }
                reject(new Error(`Execution failed <a target="_blank" href="${config.explorer}/tx/${txHash}">see Tx</a>`));
            });
        }).then(() => {

            $('#wait').hide();

            // approve disabled, cross tokens enabled
            disableApproveCross({
                approvalDisable: true,
                doNotAskDisabled: true,
                crossDisabled: false
            });
        })
        .catch((err) => {

            $('#wait').hide();
            console.error(err);
            crossTokenError(`Couldn't approve amount. ${err.message}`);

            // all options disabled:
            disableApproveCross({
                approvalDisable: true,
                doNotAskDisabled: true,
                crossDisabled: true
            });
        })
    }

    async function crossToken() {
        cleanAlertError();
        cleanAlertSuccess();
        const receiverAddress = $('#receive-address').val();
        if(!receiverAddress) {
            crossTokenError('Choose a Receiver address');
            return;
        }
        var tokenToCross = $('#tokenAddress').val();
        var token = TOKENS.find(element => element.token == tokenToCross);
        if(!token) {
            crossTokenError('Choose a token to cross');
            return;
        }
        const tokenAddress = token[config.networkId].address;
        tokenContract = new web3.eth.Contract(ERC20_ABI, tokenAddress);
        const BN = web3.utils.BN;

        const amount = $('#amount').val();
        if(!amount) {
            crossTokenError('Complete the Amount field');
            return;
        }
        if($('#amount').hasClass('is-invalid')) {
            crossTokenError('Invalid Amount');
            return;
        }
        const decimals = token[config.networkId].decimals;
        const splittedAmount = amount.split('.');
        var amountWithDecimals = splittedAmount[0];
        for(let i = 0; i < decimals; i++) {
            if(splittedAmount[1] && i < splittedAmount[1].length) {
                amountWithDecimals += splittedAmount[1][i];
            } else {
                amountWithDecimals += '0';
            }

        }
        const amountBN = new BN(amountWithDecimals).mul(new BN(feePercentageDivider)).div(new BN(feePercentageDivider - feePercentage));

        disableInputs(true);
        $('.fees').hide();
        $('#secondsPerBlock').text(config.secondsPerBlock);
        $('#wait').show();
        let gasPrice = '';

        return retry3Times(tokenContract.methods.balanceOf(address).call)
        .then(async (balance) => {
            const balanceBN = new BN(balance);
            if(balanceBN.lt(amountBN)) {
                const showBalance = new BigNumber(balance);
                throw new Error(`Insuficient Balance in your account, your current balance is ${showBalance.shiftedBy(-decimals)} ${token[config.networkId].symbol}`);
            }
            let maxWithdrawInWei = await retry3Times(allowTokensContract.methods.calcMaxWithdraw(tokenAddress).call);
            const maxWithdraw = new BN(maxWithdrawInWei);
            if(amountBN.gt(maxWithdraw)) {
                throw new Error(`Amount bigger than the daily limit. Daily limit left ${web3.utils.fromWei(maxWithdrawInWei, 'ether')} tokens`);
            }

            var gasPriceParsed = 0;
            if(config.networkId >= 30 && config.networkId <= 33) {
                let block = await web3.eth.getBlock('latest');
                gasPriceParsed = parseInt(block.minimumGasPrice);
                gasPriceParsed = gasPriceParsed <= 1 ? 1: gasPriceParsed * 1.03;
            } else {
                let gasPriceAvg = await web3.eth.getGasPrice();
                gasPriceParsed= parseInt(gasPriceAvg);
                gasPriceParsed = gasPriceParsed <= 1 ? 1: gasPriceParsed * 1.3;
            }
            gasPrice = `0x${Math.ceil(gasPriceParsed).toString(16)}`;
        }).then(async () => {
            return new Promise((resolve, reject) => {
                bridgeContract.methods
                    .receiveTokensTo(tokenContract.options.address, receiverAddress, amountBN.toString())
                    .send({from: address, gasPrice:gasPrice, gas:250_000}, async (err, txHash) => {
                    if (err) return reject(err);
                    try {
                        let receipt = await waitForReceipt(txHash);

                        disableApproveCross({
                            approvalDisable: true,
                            doNotAskDisabled: true,
                            crossDisabled: true
                        })

                        if(receipt.status) {
                            resolve(receipt);
                        }
                    } catch(err) {
                        reject(err);
                    }
                    reject(new Error(`Execution failed <a target="_blank" href="${config.explorer}/tx/${txHash}">see Tx</a>`));
                });
            });
        }).then(async (receipt) => {
            $('#wait').hide();
            $('#confirmationTime').text(config.confirmationTime);
            $('#receive').text(`${amount} ${token[config.crossToNetwork.networkId].symbol}`);
            $('#success').show();
            disableInputs(false);

            // save transaction to local storage...
            TXN_Storage.addTxn(address, config.name, {
                networkId: config.networkId,
                tokenFrom: token[config.networkId].symbol,
                tokenTo: token[config.crossToNetwork.networkId].symbol,
                amount,
                receiverAddress,
                ...receipt
            });

            updateActiveAddressTXNs(address);
            showActiveTxnsTab();
            showActiveAddressTXNs();

        }).catch((err) => {
            $('#wait').hide();
            console.error(err);
            crossTokenError(`Couln't cross the tokens. ${err.message}`);
        });
    }

    async  function getGasPriceHex() {
        var gasPriceParsed = 0;
        if(config.networkId >= 30 && config.networkId <= 33) {
            let block = await web3.eth.getBlock('latest');
            gasPriceParsed = parseInt(block.minimumGasPrice);
            gasPriceParsed = gasPriceParsed <= 1 ? 1: gasPriceParsed * 1.03;
        } else {
            let gasPriceAvg = await web3.eth.getGasPrice();
            gasPriceParsed= parseInt(gasPriceAvg);
            gasPriceParsed = gasPriceParsed <= 1 ? 1: gasPriceParsed * 1.3;
        }
        return `0x${Math.ceil(gasPriceParsed).toString(16)}`;

    }

    async function claim(txn, currentTarget) {
        console.log(currentTarget)
        const sideWeb3 = new Web3(config.crossToNetwork.rpc);
        const receipt = await sideWeb3.eth.getTransactionReceipt(txn.transactionHash);
        const eventJsonInterface = BRIDGE_ABI.find(x => x.name ==='Cross' && x.type ==='event');
        const eventSignature = web3.eth.abi.encodeEventSignature(eventJsonInterface);
        const event = receipt.logs.find(x => x.topics[0] === eventSignature);
        console.log('eventJsonInterface', eventJsonInterface)
        console.log('event', event)
        event.topics.shift();
        const decodedEvent = web3.eth.abi.decodeLog(eventJsonInterface.inputs, event.data, event.topics);
        console.log('decodedEvent', decodedEvent)

        let gasPrice = await getGasPriceHex();
        currentTarget.disable = true;

        return new Promise((resolve, reject) => {
            bridgeContract.methods.claim({
                to: decodedEvent._to,
                amount: decodedEvent._amount,
                blockHash: event.blockHash,
                transactionHash: event.transactionHash,
                logIndex: event.logIndex
            }).send({from: address, gasPrice: gasPrice, gas: 250_000}, async (err, txHash) => {
                if (err) return reject(err);
                    try {
                    let receipt = await waitForReceipt(txHash);
                    if(receipt.status) {
                        resolve(receipt);
                    }
                } catch(err) {
                    reject(err);
                }
                reject(new Error(`Execution failed <a target="_blank" href="${config.explorer}/tx/${txHash}">see Tx</a>`));
            });
        }).then(() => {
            currentTarget.disable = false;
            currentTarget.parentElement.outerHTML = '<span class="confirmed"> Claimed</span>';
        })
        .catch((err) => {
            currentTarget.disable = false;
            console.error(err);
            crossTokenError(`Couldn't Claim. ${err.message}`);
        })
    }

    function cleanAlertSuccess() {
        $('#success').hide();
    }

    function cleanAlertError() {
        $('#alert-danger-text').html('');
        $('#alert-danger').hide();
    }

    function crossTokenError(err) {
        $('#alert-danger-text').html(err);
        $('#alert-danger').show();
        $('#alert-danger').focus();
        // $('#cross').prop('disabled', false);
        $('#deposit').prop('disabled', false);

        disableInputs(false);
    }


    async function checkAllowance() {
        cleanAlertSuccess();
        let amount = $('#amount').val();
        if(amount == '') {
            markInvalidAmount('Invalid amount');
            return;
        }
        let parsedAmount = new BigNumber(amount);
        if(parsedAmount <= 0) {
            markInvalidAmount("Must be bigger than 0");
            return;
        }
        $('#secondsPerBlock').text(config.secondsPerBlock);
        $('#amount').removeClass('ok');
        let totalCost = fee == 0 ? parsedAmount : parsedAmount.dividedBy(1-fee);
        let serviceFee = totalCost.times(fee);

        let tokenToCross = $('#tokenAddress').val();
        let token = TOKENS.find(element => element.token == tokenToCross);
        const tokenAddress = token[config.networkId].address;
        tokenContract = new web3.eth.Contract(ERC20_ABI, tokenAddress);

        let allowance = await retry3Times(tokenContract.methods.allowance(address, bridgeContract.options.address).call);
        allowance = web3.utils.fromWei(allowance);
        let allowanceBN = new BigNumber(allowance);

        if(totalCost.lte(allowanceBN)) {
            $('.approve-deposit').hide();
            // straight to convert
            disableApproveCross({
                approvalDisable: true,
                doNotAskDisabled: true,
                crossDisabled: false
            });
        } else {
            // user must first approve amount
            disableApproveCross({
                approvalDisable: false,
                doNotAskDisabled: false,
                crossDisabled: true
            });
            $('.approve-deposit').show();
        }

    }

    async function isAmountOk() {
        cleanAlertSuccess();
        let amount = $('#amount').val();
        if(amount == '') {
            markInvalidAmount('Invalid amount');

            disableApproveCross({
                approvalDisable: true,
                doNotAskDisabled: true,
                crossDisabled: true
            });

            return;
        }
        let parsedAmount = new BigNumber(amount);
        if(parsedAmount <= 0) {
            markInvalidAmount("Must be bigger than 0");

            disableApproveCross({
                approvalDisable: true,
                doNotAskDisabled: true,
                crossDisabled: true
            });

            return;
        }
        $('#amount').removeClass('ok');
        let totalCost = fee == 0 ? parsedAmount : parsedAmount.dividedBy(1-fee);
        let serviceFee = totalCost.times(fee);

        $('#serviceFee').html(serviceFee.toFormat(6, BigNumber.ROUND_DOWN));
        $('#totalCost').html(totalCost.toFormat(6, BigNumber.ROUND_DOWN));
        try {
            if(totalCost < minTokensAllowed) {
                throw new Error(`Minimum amount ${minTokensAllowed - minTokensAllowed*fee} token`);
            }
            if(totalCost > maxTokensAllowed) {
                throw new Error(`Max amount ${maxTokensAllowed - maxTokensAllowed*fee} tokens`);
            }

            $('.amount .invalid-feedback').hide();
            $('#amount').removeClass('is-invalid');
            $('#amount').addClass('ok');
            $('.fees').show();
        } catch(err) {

            disableApproveCross({
                approvalDisable: true,
                doNotAskDisabled: true,
                crossDisabled: true
            });

            markInvalidAmount(err.message);
        }
    }

    function markInvalidAmount(errorDescription) {
        let invalidAmount = $('.amount .invalid-feedback');
        invalidAmount.html(errorDescription);
        invalidAmount.show();
        $('#amount').addClass('is-invalid');
        $('#amount').prop("disabled", false);
        $('#amount').removeClass('ok');
        $('.fees').hide();
    }

    async function isInstalled() {
        if (window.ethereum) {
            window.ethereum.autoRefreshOnNetworkChange = false;
        }

        const provider = await rLogin.connect()
            .then((rLoginResponse) => {
                const provider = rLoginResponse.provider;
                // const dataVault = rLoginResponse.dataVault;
                const disconnect = rLoginResponse.disconnect;

                // save the response to be used later, here we are using React context
                window.disconnect = disconnect;
                return provider;
            })
            .catch((err) => {
                console.error(err)
                throw new Error('Login failed. Please try again.')
                })
        window.web3 = new Web3(provider);
        let accounts = await getAccounts();
        let chainId = await web3.eth.net.getId();
        await updateCallback(chainId, accounts);

        provider.on('chainChanged', function(newChain) {
            updateNetwork(newChain);
            showActiveTxnsTab();
        });
        provider.on('accountsChanged', function(newAddresses) {
            checkAllowance();
            updateAddress(newAddresses).then(
                (addr) => updateActiveAddressTXNs(addr)
            ).then(() => showActiveAddressTXNs());
        });
        return chainId;
    }

    function onMetaMaskConnectionError(err) {
        $('#myModal .modal-body').html(`<p>${err.message}</p>`);
        $('#myModal').modal('show');
        $('#logIn').on('click', onLogInClick);
        $('#logIn').text('Connect wallet');
        $('#logIn').show();
        $('#transferTab').addClass('disabled');
        $('#help').hide();
        $('.wallet-status').hide();
        $('#address').text('0x00000..');
        disableInputs(true);
        tokenContract = null;
        allowTokensContract = null;
        bridgeContract = null;
        config = null;
        address = '';
    }


    function disableApproveCross({
        approvalDisable = true,
        doNotAskDisabled = true,
        crossDisabled = true
    }) {
        $('#approve').prop('disabled', approvalDisable);
        $('#doNotAskAgain').prop('disabled', doNotAskDisabled);
        $('#deposit').prop('disabled', crossDisabled);
    }

    function disableInputs(disable) {
        $("#tokenAddress").prop('disabled', disable);
        $("button[data-id='tokenAddress']").prop('disabled', disable);
        $('#amount').prop('disabled', disable);
        if(disable) {
            $('#max').off('click');
            $('#max').removeAttr('href');
        } else {
            $('#max').on('click', getMaxBalance);
            $('#max').attr('href', '#');
        }
    }

    function onMetaMaskConnectionSuccess() {
        disableInputs(false);
        disableApproveCross({
            approvalDisable: true,
            doNotAskDisabled: true,
            crossDisabled: true
        });
    }

    function updateAddress(newAddresses) {

        address = newAddresses[0];
        $('#address').text(address);
        $('#logIn').hide();
        $('#transferTab').removeClass('disabled');
        $('#help').show();
        $('.wallet-status').show();

        return Promise.resolve(address);
    }

    function updateActiveAddressTXNs(addr) {
        if(config.name.toLowerCase().includes('eth')) {
            activeAddressEth2RskTxns = TXN_Storage.getAllTxns4Address(addr, config.name);
            activeAddressRsk2EthTxns = TXN_Storage.getAllTxns4Address(addr, config.crossToNetwork.name);
        } else {
            activeAddressRsk2EthTxns = TXN_Storage.getAllTxns4Address(addr, config.name);
            activeAddressEth2RskTxns = TXN_Storage.getAllTxns4Address(addr, config.crossToNetwork.name);
        }
    }

    function showActiveTxnsTab() {
        if(config.name.toLowerCase().includes('eth')) {
            $('#nav-eth-rsk-tab')
                .addClass('active')
                .attr('aria-selected', true);

            $('#nav-eth-rsk')
                .addClass('active show');

            $('#nav-rsk-eth-tab')
                .removeClass('active')
                .attr('aria-selected', false);

            $('#nav-rsk-eth')
                .removeClass('active show');
        } else {
            $('#nav-rsk-eth-tab')
                .addClass('active')
                .attr('aria-selected', true);

            $('#nav-rsk-eth')
                .addClass('active show');

            $('#nav-eth-rsk-tab')
                .attr('aria-selected', false)
                .removeClass('active');

            $('#nav-eth-rsk')
                .removeClass('active show');
        }
    }

    async function showActiveAddressTXNs() {
        if(!address  || (!activeAddressEth2RskTxns.length && !activeAddressRsk2EthTxns.length)) {
            $('#previousTxnsEmptyTab')
                .css('margin-bottom', '6em')
                .show();
            $('#previousTxnsTab').hide()
            return;
        }

        $('#previousTxnsEmptyTab')
                .css('margin-bottom', '0em')
                .hide();
        $('#previousTxnsTab')
            .show()
            .css('margin-bottom', '6em');
        $('#txn-previous')
            .off()
            .on('click', onPreviousTxnClick);
        $('#txn-next')
            .off()
            .on('click', onNextTxnClick);

        let eth2RskTable = $('#eth-rsk-tbody');
        let rsk2EthTable = $('#rsk-eth-tbody');

        eth2RskPaginationObj = Paginator(activeAddressEth2RskTxns, eth2RskTablePage, 3);
        let {
            data: eth2RskTxns
        } = eth2RskPaginationObj;

        rsk2EthPaginationObj = Paginator(activeAddressRsk2EthTxns, rsk2EthTablePage, 3);
        let {
            data: rsk2EthTxns
        } = rsk2EthPaginationObj;

        const processTxn = async (txn, networkConfig, blockNumber, sideWeb3) => {
            const {
                confirmations,
                secondsPerBlock,
                explorer
            } = networkConfig;

            let elapsedBlocks = blockNumber - txn.blockNumber;
            let remainingBlocks2Confirmation = confirmations - elapsedBlocks;
            let status = 'Info Not Available';
            if (txn.blockNumber > networkConfig.v2UpdateBlock) {
                // V2 Protocol
                const sideBridgeContract = new sideWeb3.eth.Contract(BRIDGE_ABI, networkConfig.crossToNetwork.bridge);
                const txDataHash = await sideBridgeContract.methods.transactionsDataHashes(txn.transactionHash).call();
                if (txDataHash === NULL_HASH)
                    status = '<span class="pending"> Pending</span>'
                else {
                    const claimed = await sideBridgeContract.methods.claimed(txDataHash).call();
                    if (claimed) {
                        status = '<span class="confirmed"> Claimed</span>'
                    } else {
                        status = '<span><button class="btn btn-primary claim">Claim</button></span>'
                    }
                }
            } else {
                // V1 Protocol
                status = (elapsedBlocks >= confirmations) ?
                `<span class="confirmed"> Confirmed</span>` :
                `<span class="pending"> Pending</span>`;
            }

            let seconds2Confirmation = remainingBlocks2Confirmation > 0 ?
                remainingBlocks2Confirmation * secondsPerBlock : 0;

            let hoursToConfirmation = Math.floor(seconds2Confirmation / 60 / 60);
            let hoursToConfirmationStr = (hoursToConfirmation > 0) ? `${hoursToConfirmation}hs ` : '';
            let minutesToConfirmation = Math.floor(seconds2Confirmation / 60) - (hoursToConfirmation * 60);
            let humanTimeToConfirmation = (elapsedBlocks < confirmations)
                ? `| ~ ${hoursToConfirmationStr} ${minutesToConfirmation}mins`
                : '';

            let txnExplorerLink = `${explorer}/tx/${txn.transactionHash}`;
            let shortTxnHash = `${txn.transactionHash.substring(0, 8)}...${txn.transactionHash.slice(-8)}`;

            let htmlRow = `<tr class="black">
                <th scope="row"><a class="confirmed" href="${txnExplorerLink}">${shortTxnHash}</a></th>
                <td>${txn.blockNumber}</td>
                <td>${txn.amount} ${txn.tokenFrom}</td>
                <td>${status} ${humanTimeToConfirmation}</td>
            </tr>`;

            return htmlRow;
        }

        let rskConfig = config;
        let ethConfig = config.crossToNetwork;
        let rskWeb3 = web3;
        let ethWeb3 = new Web3(config.crossToNetwork.rpc);
        let rskBlockNumber = currentBlockNumber;
        let ethBlockNumber = await ethWeb3.eth.getBlockNumber();
        if(config.name.toLowerCase().includes('eth')) {
            rskConfig = config.crossToNetwork;
            ethConfig = config;
            rskWeb3 = new Web3(config.crossToNetwork.rpc);
            ethWeb3 = web3;
            rskBlockNumber = await ethWeb3.eth.getBlockNumber();
            ethBlockNumber = currentBlockNumber;
        }
        const activeAddressTXNsEth2RskRowsPromises = Promise.all(eth2RskTxns.map(txn => {
            return processTxn(txn, ethConfig, ethBlockNumber, rskWeb3);
        }));
        const activeAddressTXNsRsk2EthRowsPromises = Promise.all(rsk2EthTxns.map(txn => {
            return processTxn(txn, rskConfig, rskBlockNumber, ethWeb3);
        }));

        const activeAddressTXNsEth2RskRows = await activeAddressTXNsEth2RskRowsPromises;
        const activeAddressTXNsRsk2EthRows = await activeAddressTXNsRsk2EthRowsPromises;
        eth2RskTable.html(activeAddressTXNsEth2RskRows.join());
        rsk2EthTable.html(activeAddressTXNsRsk2EthRows.join());

    }

    async function updateCallback(chainId, accounts) {
        return updateNetwork(chainId).then( () =>
            updateAddress(accounts)
        ).then( (addr) =>
            updateActiveAddressTXNs(addr)
        ).then( () =>
            showActiveAddressTXNs()
        )
    }

    function updateNetworkConfig(config) {
        $('.fromNetwork').text(config.name);
        $('.indicator span').html(config.name);
        $('.indicator').removeClass('btn-outline-danger');
        $('.indicator').addClass('btn-outline-success');
        $('.toNetwork').text(config.crossToNetwork.name);
        $('#confirmations').html(config.confirmations);
        $('#timeToCross').html(config.crossToNetwork.confirmationTime);
        updateTokenAddressDropdown(config.networkId);
    }

    async function updateNetwork(newNetwork) {
        cleanAlertSuccess();
        try {
            newNetwork = parseInt(newNetwork);
            if(config && config.networkId == newNetwork) return;

            config = null;
            if(isTestnet) {
                switch (newNetwork) {
                case 42:
                    config = KOVAN_CONFIG;
                    break;
                case 31:
                    config = RSK_TESTNET_CONFIG;
                    break;
                }
            } else {
                switch (newNetwork) {
                case 1:
                    config = ETH_CONFIG;
                    break;
                case 30:
                    config = RSK_MAINNET_CONFIG;
                    break;
                }
            }
            if(config == null) {
                $('.fromNetwork').text('From Network');
                $('.indicator span').html('Unknown Network');
                $('.indicator').removeClass('btn-outline-success');
                $('.indicator').addClass('btn-outline-danger');
                $('.toNetwork').text('To Network');
                $('#willReceiveToken').html('');
                throw new Error(`Wrong Network.<br /> Please connect your wallet to <b>${isTestnet ? 'RSK Testnet or Ethereum Kovan' : 'RSK Mainnet or Ethereum Mainnet'}</b>`);
            }
            allowTokensContract = new web3.eth.Contract(ALLOW_TOKENS_ABI, config.allowTokens);
            bridgeContract = new web3.eth.Contract(BRIDGE_ABI, config.bridge);
            federationContract = new web3.eth.Contract(FEDERATION_ABI, config.federation);

            $('#myModal').modal('hide');
            updateNetworkConfig(config);
            updateTokenAddressDropdown(config.networkId);

            setInfoTab();
            onMetaMaskConnectionSuccess();

            await poll4LastBlockNumber(
                function(blockNumber) {
                    currentBlockNumber = blockNumber;
                    showActiveAddressTXNs();
                }
            );

            if (TXN_Storage.isStorageAvailable('localStorage')) {
                console.log(`Local Storage Available!`);
            } else {
                console.log(`Local Storage Unavailable!`);
            }

        } catch(err) {
            onMetaMaskConnectionError(err);
            throw err;
        };
    }

    function updateTokenAddressDropdown(networkId) {
        let selectHtml = '';
        for(let aToken of TOKENS) {
            if(aToken[networkId] != undefined) {
                selectHtml += `\n<option value="${aToken.token}" `;
                selectHtml += `data-content="<span><img src='${aToken.icon}' class='token-logo'></span>${aToken[networkId].symbol}">`;
                selectHtml += `\n</option>`;
            }
        }
        $('#tokenAddress').html(selectHtml);
        $('#tokenAddress').prop('disabled', false);
        $('#tokenAddress').selectpicker('refresh');
        $('#willReceiveToken').html('')
    }

    function updateTokenListTab() {
        let rskConfig = RSK_TESTNET_CONFIG;
        if(!isTestnet)
            rskConfig = RSK_MAINNET_CONFIG;

        let tabHtml = `<div class="row mb-3 justify-content-center text-center">`;
        tabHtml += `\n    <div class="col-5">`;
        tabHtml += `\n        ${rskConfig.name}`;
        tabHtml += `\n    </div>`;
        tabHtml += `\n    <div class="col-1"></div>`;
        tabHtml += `\n    <div class="col-5">`;
        tabHtml += `\n        ${rskConfig.crossToNetwork.name}`;
        tabHtml += `\n    </div>`;
        tabHtml += `\n</div>`;
        for(let aToken of TOKENS) {
            if(aToken[rskConfig.networkId] != undefined) {
                tabHtml += `\n<div class="row mb-3 justify-content-center">`;
                tabHtml += `\n    <div class="col-5 row">`;
                tabHtml += `\n      <div class="col-8 font-weight-bold">`;
                tabHtml += `\n          <a href="${rskConfig.explorer}/address/${aToken[rskConfig.networkId].address.toLowerCase()}" class="address" target="_blank">`;
                tabHtml += `\n            <span><img src="${aToken.icon}" class="token-logo"></span>${aToken[rskConfig.networkId].symbol}`;
                tabHtml += `\n          </a>`;
                tabHtml += `\n       </div>`;
                tabHtml += `\n       <div class="col-4">`;
                tabHtml += `\n           <button class="copy btn btn-outline-secondary" type="button" data-clipboard-text="${aToken[rskConfig.networkId].address.toLowerCase()}" data-toggle="tooltip" data-placement="bottom" title="Copy token address to clipboard">`;
                tabHtml += `\n                <i class="far fa-copy"></i>`;
                tabHtml += `\n           </button>`;
                tabHtml += `\n       </div>`;
                tabHtml += `\n    </div>`;
                tabHtml += `\n    <div class="col-2 text-center">`;
                tabHtml += `\n        <i class="fas fa-arrows-alt-h"></i>`;
                tabHtml += `\n    </div>`;
                tabHtml += `\n    <div class="col-5 row">`;
                tabHtml += `\n      <div class="col-8 font-weight-bold">`;
                tabHtml += `\n          <a href="${rskConfig.crossToNetwork.explorer}/address/${aToken[rskConfig.crossToNetwork.networkId].address.toLowerCase()}" class="address" target="_blank">`;
                tabHtml += `\n              <span><img src="${aToken.icon}" class="token-logo"></span>${aToken[rskConfig.crossToNetwork.networkId].symbol}`;
                tabHtml += `\n          </a>`;
                tabHtml += `\n      </div>`;
                tabHtml += `\n      <div class="col-4">`;
                tabHtml += `\n          <button class="copy btn btn-outline-secondary" type="button" data-clipboard-text="${aToken[rskConfig.crossToNetwork.networkId].address.toLowerCase()}" data-toggle="tooltip" data-placement="bottom" title="Copy the address">`;
                tabHtml += `\n              <i class="far fa-copy"></i>`;
                tabHtml += `\n          </button>`;
                tabHtml += `\n      </div>`;
                tabHtml += `\n    </div>`;
                tabHtml += `\n</div>`;
            }
        }
        $('#tokenListTab').html(tabHtml);
    }

    async function getAccounts() {
        let accounts = await web3.eth.getAccounts();
        if (accounts.length === 0)
            throw new Error('Nifty Wallet or MetaMask is Locked, please unlock it and Reload the page to continue');
        return accounts;
    }

  }
}
</script>
