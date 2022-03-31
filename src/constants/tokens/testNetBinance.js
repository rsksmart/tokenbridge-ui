import * as tokensInfo from '../tokensInfo'
import * as methodType from '../methodType'

export const TEST_NET_BINANCE_GAS_TOKEN = {
  ...tokensInfo.TOKEN_WBNB_INFO,
  symbol: 'BNB',
}

export const TEST_NET_BINANCE_MAIN_TOKEN = {
  ...tokensInfo.TOKEN_WBNB_INFO,
  symbol: 'BNB',
  address: '0xae13d989dac2f0debff460ac112a837c89baa7cd',
  decimals: 18,
  methodType: methodType.DEPOSITOR,
}


export const TEST_NET_BINANCE_TOKENS = [
  TEST_NET_BINANCE_MAIN_TOKEN,
  {
    ...tokensInfo.TOKEN_WBTC_INFO,
    symbol: 'BTCB',
    address: '0x6ce8da28e2f864420840cf74474eff5fd80e65b8',
    decimals: 18,
    methodType: methodType.RECEIVER,
  },
  // {
  //   ...tokensInfo.TOKEN_BUSD_INFO,
  //   symbol: 'BUSD',
  //   address: '0x110887fc420292dce51c08504cee377872d0db66',
  //   decimals: 18,
  //   methodType: methodType.RECEIVER,
  // },
  {
    ...tokensInfo.TOKEN_DAI_INFO,
    symbol: 'DAI',
    address: '0x13878644c0F2C9C5c8A85dA43ebC3Bb74bBc05A9',
    decimals: 18,
    methodType: methodType.RECEIVER,
  },
  {
    ...tokensInfo.TOKEN_WETH_INFO,
    symbol: 'ETH',
    address: '0x8babbb98678facc7342735486c851abd7a0d17ca',
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
    ...tokensInfo.TOKEN_USDC_INFO,
    symbol: 'USDC',
    address: '0x5d47b6e7edfc82e2ecd481b3db70d0f6600fdef8',
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
