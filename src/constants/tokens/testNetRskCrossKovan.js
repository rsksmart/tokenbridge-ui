import * as tokensInfo from '../tokensInfo'
import * as methodType from '../methodType'

export const TEST_NET_RSK_CROSS_KOVAN_GAS_TOKEN = {
  ...tokensInfo.TOKEN_RBTC_INFO,
  symbol: 'rBTC',
}

export const TEST_NET_RSK_CROSS_KOVAN_MAIN_TOKEN = {
  ...tokensInfo.TOKEN_WETH_INFO,
  symbol: 'rETH',
  address: '0xd15cDD74DfF1A6A81Ca639B038839B126BC01FF9',
  decimals: 18,
  methodType: methodType.RECEIVER,
}

export const TEST_NET_RSK_CROSS_KOVAN_TOKENS = [
  {
    ...tokensInfo.TOKEN_DAI_INFO,
    symbol: 'rKovDAI',
    address: '0x7b846216a194c69bb1ea52ea8faa92d314866451',
    decimals: 18,
    methodType: methodType.RECEIVER,
  },
  {
    ...tokensInfo.TOKEN_LINK_INFO,
    symbol: 'rKovLINK',
    address: '0x8bbbd80981fe76d44854d8df305e8985c19f0e78',
    decimals: 18,
    methodType: methodType.RECEIVER,
  },
  {
    ...tokensInfo.TOKEN_USDT_INFO,
    symbol: 'rKovUSDT',
    address: '0x4cfE225cE54c6609a525768b13F7d87432358C57',
    decimals: 18,
    methodType: methodType.RECEIVER,
  },
  {
    ...tokensInfo.TOKEN_BUND_INFO,
    symbol: 'rBUND',
    address: '0xe95afdfec031f7b9cd942eb7e60f053fb605dfcd',
    decimals: 18,
    methodType: methodType.RECEIVER,
  },
]
