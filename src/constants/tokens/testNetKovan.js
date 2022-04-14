import * as tokensInfo from '../tokensInfo'
import * as methodType from '../methodType'

export const TEST_NET_KOVAN_GAS_TOKEN = {
  ...tokensInfo.TOKEN_WETH_INFO,
  symbol: 'ETH',
}

export const TEST_NET_KOVAN_MAIN_TOKEN = {
  ...tokensInfo.TOKEN_WETH_INFO,
  symbol: 'ETH',
  address: '0xd0A1E359811322d97991E03f863a0C30C2cF029C',
  decimals: 18,
  methodType: methodType.DEPOSITOR,
}

export const TEST_NET_KOVAN_TOKENS = [
  {
    ...tokensInfo.TOKEN_DAI_INFO,
    symbol: 'DAI',
    address: '0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa',
    decimals: 18,
    methodType: methodType.RECEIVER,
  },
  {
    ...tokensInfo.TOKEN_LINK_INFO,
    symbol: 'LINK',
    address: '0xa36085F69e2889c224210F603D836748e7dC0088',
    decimals: 18,
    methodType: methodType.RECEIVER,
  },
  {
    ...tokensInfo.TOKEN_USDT_INFO,
    symbol: 'USDT',
    address: '0x13512979ade267ab5100878e2e0f485b568328a4',
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
