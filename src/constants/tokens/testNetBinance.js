import * as tokensInfo from '../tokensInfo'
import * as methodType from '../methodType'

export const TEST_NET_BINANCE_TOKENS = [
  {
    ...tokensInfo.TOKEN_DAI_INFO,
    symbol: 'DAI',
    address: '0x13878644c0f2c9c5c8a85da43ebc3bb74bbc05a9',
    decimals: 18,
    methodType: methodType.RECEIVER,
  },
  {
    ...tokensInfo.TOKEN_WBNB_INFO,
    symbol: 'BNB',
    address: '0xae13d989dac2f0debff460ac112a837c89baa7cd',
    decimals: 18,
    methodType: methodType.DEPOSITOR,
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
