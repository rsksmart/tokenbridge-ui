import * as tokensInfo from '../tokensInfo'
import * as methodType from '../methodType'

export const TEST_NET_SEPOLIA_GAS_TOKEN = {
  ...tokensInfo.TOKEN_WETH_INFO,
  symbol: 'SepoliaETH',
}

export const TEST_NET_SEPOLIA_MAIN_TOKEN = {
  ...tokensInfo.TOKEN_WETH_INFO,
  symbol: 'SepoliaETH',
  address: '0xe21bC895ff273c7a60Fda822Fc224A393B45aDE9',
  decimals: 18,
  methodType: methodType.DEPOSITOR,
}

export const TEST_NET_SEPOLIA_TOKENS = [
  {
    ...tokensInfo.TOKEN_DAI_INFO,
    symbol: 'DAI',
    address: '0x53844F9577C2334e541Aec7Df7174ECe5dF1fCf0',
    decimals: 18,
    methodType: methodType.RECEIVER,
  },
  {
    ...tokensInfo.TOKEN_LINK_INFO,
    symbol: 'LINK',
    address: '0x779877A7B0D9E8603169DdbD7836e478b4624789',
    decimals: 18,
    methodType: methodType.RECEIVER,
  },
  {
    ...tokensInfo.TOKEN_USDT_INFO,
    symbol: 'USDT',
    address: '0x7169D38820dfd117C3FA1f22a697dBA58d90BA06',
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
