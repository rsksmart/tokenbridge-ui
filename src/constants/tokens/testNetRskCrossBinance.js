import * as tokensInfo from '../tokensInfo'
import * as methodType from '../methodType'

export const TEST_NET_RSK_CROSS_BINANCE_MAIN_TOKEN = {
  ...tokensInfo.TOKEN_WBNB_INFO,
  symbol: 'bWBNB',
  address: '0x0a94c1a74cc54a7fa2cf6222bdfecbd59ce186b4',
  decimals: 18,
  methodType: methodType.RECEIVER,
}

export const TEST_NET_RSK_CROSS_BINANCE_TOKENS = [
  TEST_NET_RSK_CROSS_BINANCE_MAIN_TOKEN,
  {
    ...tokensInfo.TOKEN_DAI_INFO,
    symbol: 'bDAI',
    address: '0x51969ABE923d88CD38A7f1A4ee963E7fD58cD9ae',
    decimals: 18,
    methodType: methodType.RECEIVER,
  },
  {
    ...tokensInfo.TOKEN_USDT_INFO,
    symbol: 'bUSDT',
    address: '0x6F0afFe4c1106DFD91352C8C99c88394ED4eABc0',
    decimals: 18,
    methodType: methodType.RECEIVER,
  },
  {
    ...tokensInfo.TOKEN_RIF_INFO,
    symbol: 'tRIF',
    address: '0x19f64674d8a5b4e652319f5e239efd3bc969a1fe',
    decimals: 18,
    methodType: methodType.RECEIVER,
  },
]
