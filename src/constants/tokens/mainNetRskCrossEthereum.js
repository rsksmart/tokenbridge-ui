import * as tokensInfo from '../tokensInfo'
import * as methodType from '../methodType'

export const MAIN_NET_RSK_CROSS_ETHEREUM_GAS_TOKEN = {
  ...tokensInfo.TOKEN_RBTC_INFO,
  symbol: 'rBTC',
}

export const MAIN_NET_RSK_CROSS_ETHEREUM_MAIN_TOKEN = {
  ...tokensInfo.TOKEN_WETH_INFO,
  symbol: 'ETH',
}

export const MAIN_NET_RSK_CROSS_ETHEREUM_TOKENS = [
  {
    ...tokensInfo.TOKEN_DAI_INFO,
    symbol: 'rDAI',
    address: '0x6b1a73d547f4009a26b8485b63d7015d248ad406',
    decimals: 18,
    methodType: methodType.RECEIVER,
  },
  {
    ...tokensInfo.TOKEN_LINK_INFO,
    symbol: 'rLINK',
    address: '0x14adae34bef7ca957ce2dde5add97ea050123827',
    decimals: 18,
    methodType: methodType.RECEIVER,
  },
  {
    ...tokensInfo.TOKEN_USDT_INFO,
    symbol: 'rUSDT',
    address: '0xef213441a85df4d7acbdae0cf78004e1e486bb96',
    decimals: 18,
    methodType: methodType.RECEIVER,
  },
]
