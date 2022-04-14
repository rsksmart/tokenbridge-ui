import * as tokensInfo from '../tokensInfo'
import * as methodType from '../methodType'

export const MAIN_NET_ETHEREUM_MAIN_TOKEN = {
  ...tokensInfo.TOKEN_WETH_INFO,
  symbol: 'ETH',
}

export const MAIN_NET_ETHEREUM_GAS_TOKEN = {
  ...MAIN_NET_ETHEREUM_MAIN_TOKEN,
}

export const MAIN_NET_ETHEREUM_TOKENS = [
  {
    ...tokensInfo.TOKEN_DAI_INFO,
    symbol: 'DAI',
    address: '0x6b175474e89094c44da98b954eedeac495271d0f',
    decimals: 18,
    methodType: methodType.RECEIVER,
  },
  {
    ...tokensInfo.TOKEN_LINK_INFO,
    symbol: 'LINK',
    address: '0x514910771af9ca656af840dff83e8264ecf986ca',
    decimals: 18,
    methodType: methodType.RECEIVER,
  },
  {
    ...tokensInfo.TOKEN_USDT_INFO,
    symbol: 'USDT',
    address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    decimals: 6,
    methodType: methodType.RECEIVER,
  },
  {
    ...tokensInfo.TOKEN_BUND_INFO,
    symbol: 'BUND',
    address: '0x8d3e855f3f55109d473735ab76f753218400fe96',
    decimals: 18,
    methodType: methodType.RECEIVER,
  },
]
