import * as tokensInfo from '../tokensInfo'
import * as methodType from '../methodType'

export const TEST_NET_RSK_CROSS_BINANCE_GAS_TOKEN = {
  ...tokensInfo.TOKEN_RBTC_INFO,
  symbol: 'rBTC',
}

export const TEST_NET_RSK_CROSS_BINANCE_MAIN_TOKEN = {
  ...tokensInfo.TOKEN_WBNB_INFO,
  symbol: 'bWBNB',
  address: '0x6AdEa289bf57633f0287b7e423042AaFCA25eee6',
  decimals: 18,
  methodType: methodType.RECEIVER,
}

export const TEST_NET_RSK_CROSS_BINANCE_TOKENS = [
  TEST_NET_RSK_CROSS_BINANCE_MAIN_TOKEN,
  {
    ...tokensInfo.TOKEN_DAI_INFO,
    symbol: 'rbDAI',
    address: '0xD2B70200124971A93cAff143Cce934b190DC6591',
    decimals: 18,
    methodType: methodType.RECEIVER,
  },
  {
    ...tokensInfo.TOKEN_WBTC_INFO,
    symbol: 'rbBTC',
    address: '0xD2B70200124971A93cAff143Cce934b190DC6591',
    decimals: 18,
    methodType: methodType.RECEIVER,
  },
  {
    ...tokensInfo.TOKEN_WETH_INFO,
    symbol: 'rbETH',
    address: '0x99B39B5ece930276A3D501c568e17F38712BC59c',
    decimals: 18,
    methodType: methodType.RECEIVER,
  },
  {
    ...tokensInfo.TOKEN_USDC_INFO,
    symbol: 'rbUSDC',
    address: '0xFb478a7d021Cd2Aef81eB8ff3E867CB881688627',
    decimals: 18,
    methodType: methodType.RECEIVER,
  },
  {
    ...tokensInfo.TOKEN_USDT_INFO,
    symbol: 'rbUSDT',
    address: '0x092ccF813566C9B4130cE6d4e85d5228Ec0f48Bb',
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
