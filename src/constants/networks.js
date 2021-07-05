// --------- CONFIGS ----------
export const KOVAN_CONFIG = {
  networkId: 42,
  name: 'Kovan',
  bridge: '0x12ed69359919fc775bc2674860e8fe2d2b6a7b5d',
  allowTokens: '0x92BF86334583909B60F9b798A9Dd7Debd899fEc4',
  federation: '0xa347438BC288f56Cb6083A79133e70DD2d1f6c2d',
  explorer: 'https://kovan.etherscan.io',
  explorerTokenTab: '#tokentxns',
  confirmations: 10,
  confirmationTime: '5 minutes',
  secondsPerBlock: 5,
  rpc: `https://kovan.infura.io/v3/${process.env.VUE_APP_INFURA_KEY}`,
  v2UpdateBlock: 25547922,
  feePercentageDivider: 10_000,
}
export const RSK_TESTNET_CONFIG = {
  networkId: 31,
  name: 'RSK Testnet',
  bridge: '0x684a8a976635fb7ad74a0134ace990a6a0fcce84',
  allowTokens: '0xc65bf0ae75dc1a5fc9e6f4215125692a548c773a',
  federation: '0x5d663981d930e8ec108280b9d80885658148ab0f',
  explorer: 'https://explorer.testnet.rsk.co',
  explorerTokenTab: '?__tab=tokens%20transfers',
  confirmations: 10,
  confirmationTime: '3 minutes',
  secondsPerBlock: 30,
  rpc: 'https://public-node.testnet.rsk.co',
  v2UpdateBlock: 1945524,
  feePercentageDivider: 10_000,
  crossToNetwork: KOVAN_CONFIG,
}
KOVAN_CONFIG.crossToNetwork = RSK_TESTNET_CONFIG

// Replace with proper values contracts exist in mainnet
export const ETH_CONFIG = {
  networkId: 1,
  name: 'Ethereum',
  bridge: '0x12ed69359919fc775bc2674860e8fe2d2b6a7b5d',
  allowTokens: '0xe4aa0f414725c9322a1a9d80d469c5e234786653',
  federation: '0x479f86ecbe766073d2712ef418aceb56d5362a2b',
  explorer: 'https://etherscan.io',
  explorerTokenTab: '#tokentxns',
  confirmations: 5760,
  confirmationTime: '24 hours',
  secondsPerBlock: 15,
  rpc: `https://mainnet.infura.io/v3/${process.env.VUE_APP_INFURA_KEY}`,
  feePercentageDivider: 10_000,
}
export const RSK_MAINNET_CONFIG = {
  networkId: 30,
  name: 'RSK Mainnet',
  bridge: '0x9d11937e2179dc5270aa86a3f8143232d6da0e69',
  allowTokens: '0xe4aa0f414725c9322a1a9d80d469c5e234786653',
  federation: '0xe37b6516f4fe2a27569a2751c1ad50f6340df369',
  explorer: 'https://explorer.rsk.co',
  explorerTokenTab: '?__tab=tokens%20transfers',
  confirmations: 2880,
  confirmationTime: '24 hours',
  secondsPerBlock: 30,
  rpc: 'https://public-node.rsk.co',
  feePercentageDivider: 10_000,
  crossToNetwork: ETH_CONFIG,
}
ETH_CONFIG.crossToNetwork = RSK_MAINNET_CONFIG

export const NETWORKS = {
  31: RSK_TESTNET_CONFIG,
  30: RSK_MAINNET_CONFIG,
  42: KOVAN_CONFIG,
  1: ETH_CONFIG,
}
