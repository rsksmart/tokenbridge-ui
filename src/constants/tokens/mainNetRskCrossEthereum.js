import * as tokensInfo from '../tokensInfo'
import * as methodType from '../methodType'

export const MAIN_NET_RSK_CROSS_ETHEREUM_TOKENS = [
  {
    ...tokensInfo.TOKEN_DOC_INFO,
    symbol: 'DOC',
    address: '0xe700691da7b9851f2f35f8b8182c69c53ccad9db',
    decimals: 18,
    methodType: methodType.RECEIVER,
  },
  {
    ...tokensInfo.TOKEN_DAI_INFO,
    symbol: 'rDAI',
    address: '0x6b1a73d547f4009a26b8485b63d7015d248ad406',
    decimals: 18,
    methodType: methodType.RECEIVER,
  },
  {
    ...tokensInfo.TOKEN_RIF_INFO,
    symbol: 'RIF',
    address: '0x2acc95758f8b5f583470ba265eb685a8f45fc9d5',
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
  {
    ...tokensInfo.TOKEN_USDC_INFO,
    symbol: 'rUSDC',
    address: '0x1bda44fda023f2af8280a16fd1b01d1a493ba6c4',
    decimals: 18,
    methodType: methodType.RECEIVER,
  },
  {
    ...tokensInfo.TOKEN_FLIXX_INFO,
    symbol: 'rFLIXX',
    address: '0x73c08467e23f7dcb7ddbbc8d05041b74467a498a',
    decimals: 18,
    methodType: methodType.RECEIVER,
  },
  {
    ...tokensInfo.TOKEN_RFOX_INFO,
    symbol: 'rRFOX',
    address: '0x9c3a5f8d686fade293c0ce989a62a34408c4e307',
    decimals: 18,
    methodType: methodType.RECEIVER,
  },
  {
    ...tokensInfo.TOKEN_BUND_INFO,
    symbol: 'rBUND',
    address: '0x4991516df6053121121274397a8c1dad608bc95b',
    decimals: 18,
    methodType: methodType.RECEIVER,
  },
  {
    ...tokensInfo.TOKEN_AMLT_INFO,
    symbol: 'rAMLT',
    address: '0xff9ea341d9ea91cb7c54342354377f5104fd403f',
    decimals: 18,
    methodType: methodType.RECEIVER,
  },
  {
    ...tokensInfo.TOKEN_UBI_INFO,
    symbol: 'rUBI',
    address: '0x70566d8541beabe984c8babf8a816ed908514ba8',
    decimals: 18,
    methodType: methodType.RECEIVER,
  },
]
