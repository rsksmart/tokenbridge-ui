import * as tokensInfo from '../tokensInfo'
import * as methodType from '../methodType'

export const TEST_NET_RSK_CROSS_SEPOLIA_GAS_TOKEN = {
  ...tokensInfo.TOKEN_RBTC_INFO,
  symbol: 'rBTC',
}

export const TEST_NET_RSK_CROSS_SEPOLIA_MAIN_TOKEN = {
  ...tokensInfo.TOKEN_WETH_INFO,
  symbol: 'rETH',
  address: '0xd15cDD74DfF1A6A81Ca639B038839B126BC01FF9',
  decimals: 18,
  methodType: methodType.RECEIVER,
}

export const TEST_NET_RSK_CROSS_SEPOLIA_TOKENS = [
  {
    ...tokensInfo.TOKEN_DAI_INFO,
    symbol: 'rDAI',
    address: '0xE283333e5d618a65E9F0ec25f9893ba39674c63B',
    decimals: 18,
    methodType: methodType.RECEIVER,
  },
  {
    ...tokensInfo.TOKEN_LINK_INFO,
    symbol: 'rLINK',
    address: '0x2d850c8E369F26bc02fF4c9fFbaE2d50107395CB',
    decimals: 18,
    methodType: methodType.RECEIVER,
  },
  {
    ...tokensInfo.TOKEN_USDT_INFO,
    symbol: 'rUSDT',
    address: '0xE283333e5d618a65E9F0ec25f9893ba39674c63B',
    decimals: 18,
    methodType: methodType.RECEIVER,
  }
]
