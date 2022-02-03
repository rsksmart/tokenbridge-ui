import * as tokensInfo from '../tokensInfo'
import * as methodType from '../methodType'

export const TEST_NET_BINANCE_GAS_TOKEN = {
  ...tokensInfo.TOKEN_WBNB_INFO,
  symbol: 'BNB',
}

export const TEST_NET_BINANCE_MAIN_TOKEN = {
  ...tokensInfo.TOKEN_WBNB_INFO,
  symbol: 'BNB',
  address: '0xa9f70D8c300B28DB2c94eD1690EA7c161a905B63',
  decimals: 18,
  methodType: methodType.DEPOSITOR,
}

export const TEST_NET_BINANCE_TOKENS = [
  TEST_NET_BINANCE_MAIN_TOKEN,
  {
    ...tokensInfo.TOKEN_DAI_INFO,
    symbol: 'DAI',
    address: '0xec5dcb5dbf4b114c9d0f65bccab49ec54f6a0867',
    decimals: 18,
    methodType: methodType.RECEIVER,
  },
  {
    ...tokensInfo.TOKEN_USDT_INFO,
    symbol: 'USDT',
    address: '0x337610d27c682e347c9cd60bd4b3b107c9d34ddd',
    decimals: 18,
    methodType: methodType.RECEIVER,
  },
  {
    ...tokensInfo.TOKEN_RIF_INFO,
    symbol: 'btRIF',
    address: '0xbC59e0CAB442f05F6eE8718C248C466Fbe39D292',
    decimals: 18,
    methodType: methodType.RECEIVER,
  },
]
