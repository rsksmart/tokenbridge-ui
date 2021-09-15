import * as tokensInfo from '../tokensInfo'
import * as methodType from '../methodType'

export const MAIN_NET_ETHEREUM_TOKENS = [
  {
    ...tokensInfo.TOKEN_DOC_INFO,
    symbol: 'eDOC',
    address: '0x69f6d4D4813F8e2e618DAE7572e04b6D5329E207',
    decimals: 18,
    methodType: methodType.RECEIVER,
  },
  {
    ...tokensInfo.TOKEN_DAI_INFO,
    symbol: 'DAI',
    address: '0x6b175474e89094c44da98b954eedeac495271d0f',
    decimals: 18,
    methodType: methodType.RECEIVER,
  },
  {
    ...tokensInfo.TOKEN_RIF_INFO,
    symbol: 'eRIF',
    address: '0x73c08467e23f7dcb7ddbbc8d05041b74467a498a',
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
    ...tokensInfo.TOKEN_USDC_INFO,
    symbol: 'USDC',
    address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    decimals: 6,
    methodType: methodType.RECEIVER,
  },
  {
    ...tokensInfo.TOKEN_FLIXX_INFO,
    symbol: 'FLIXX',
    address: '0xf04a8ac553fcedb5ba99a64799155826c136b0be',
    decimals: 18,
    methodType: methodType.RECEIVER,
  },
  {
    ...tokensInfo.TOKEN_RFOX_INFO,
    symbol: 'RFOX',
    address: '0xa1d6df714f91debf4e0802a542e13067f31b8262',
    decimals: 18,
    methodType: methodType.RECEIVER,
  },
  {
    ...tokensInfo.TOKEN_BUND_INFO,
    symbol: 'BUND',
    address: '0x8d3e855f3f55109d473735ab76f753218400fe96',
    decimals: 18,
    methodType: methodType.RECEIVER,
  },
  {
    ...tokensInfo.TOKEN_AMLT_INFO,
    symbol: 'AMLT',
    address: '0xca0e7269600d353f70b14ad118a49575455c0f2f',
    decimals: 18,
    methodType: methodType.RECEIVER,
  },
  {
    ...tokensInfo.TOKEN_UBI_INFO,
    symbol: 'UBI',
    address: '0xdd1ad9a21ce722c151a836373babe42c868ce9a4',
    decimals: 18,
    methodType: methodType.RECEIVER,
  },
]
