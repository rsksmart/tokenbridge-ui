// --------- CONFIGS ----------
export const KOVAN_CONFIG = {
  networkId: 42,
  name: 'Kovan',
  localStorageName: 'ethereum-kovan',
  bridge: '0x12ed69359919fc775bc2674860e8fe2d2b6a7b5d',
  allowTokens: '0x92BF86334583909B60F9b798A9Dd7Debd899fEc4',
  federation: '0xa347438BC288f56Cb6083A79133e70DD2d1f6c2d',
  explorer: 'https://kovan.etherscan.io',
  explorerTokenTab: '#tokentxns',
  secondsPerBlock: 5,
  rpc: `https://kovan.infura.io/v3/${process.env.VUE_APP_INFURA_KEY}`,
  v2UpdateBlock: 25547922,
  feePercentageDivider: 10_000,
  isRsk: false,
  isEth: true,
}

export const RINKEBY_CONFIG = {
  networkId: 4,
  name: 'Rinkeby',
  localStorageName: 'ethereum-rinkevy',
  bridge: '0x7E339118346364d7D86AB67cb0775CBB808E65F7',
  allowTokens: '0xAE3852306015df037D458a65173BBc7527F4680b',
  federation: '0xBC383764ceBc13b66c04E1abeb36804a0Caaa5C6',
  nftBridge: '0xB9b8d1e30F0EBEC0C8F4CF0B1717566d84FC4080',
  explorer: 'https://rinkeby.etherscan.io',
  explorerTokenTab: '#tokentxns',
  secondsPerBlock: 5,
  rpc: `https://rinkeby.infura.io/v3/${process.env.VUE_APP_INFURA_KEY}`,
  v2UpdateBlock: 25547922,
  feePercentageDivider: 10_000,
  isRsk: false,
  isEth: true,
}

export const RSK_TESTNET_KOVAN_CONFIG = {
  networkId: 31,
  name: 'RSK Testnet',
  localStorageName: 'rsk-testnet',
  bridge: '0x684a8a976635fb7ad74a0134ace990a6a0fcce84',
  allowTokens: '0xc65bf0ae75dc1a5fc9e6f4215125692a548c773a',
  federation: '0x5d663981d930e8ec108280b9d80885658148ab0f',
  explorer: 'https://explorer.testnet.rsk.co',
  explorerTokenTab: '?__tab=tokens%20transfers',
  secondsPerBlock: 30,
  rpc: 'https://public-node.testnet.rsk.co',
  v2UpdateBlock: 1945524,
  feePercentageDivider: 10_000,
  crossToNetwork: KOVAN_CONFIG,
  isRsk: true,
  isEth: false,
}

export const RSK_TESTNET_CONFIG = {
  networkId: 31,
  name: 'RSK Testnet',
  localStorageName: 'rsk-testnet',
  bridge: '0x8c8a34fe13400169a8da50908dffde4985237d19',
  allowTokens: '0x71f228664e2a118decd19b68c5151014769757a0',
  federation: '0xbc7a3f163b2fe1d6810a942417922f09f1fe82ed',
  nftBridge: '0xd28f2eeb1a242462149542bdf90c4cc99271fa70',
  explorer: 'https://explorer.testnet.rsk.co',
  explorerTokenTab: '?__tab=tokens%20transfers',
  secondsPerBlock: 30,
  rpc: 'https://public-node.testnet.rsk.co',
  v2UpdateBlock: 1945524,
  feePercentageDivider: 10_000,
  crossToNetwork: RINKEBY_CONFIG,
  isRsk: true,
  isEth: false,
}
RINKEBY_CONFIG.crossToNetwork = RSK_TESTNET_CONFIG

// Replace with proper values contracts exist in mainnet
export const ETH_CONFIG = {
  networkId: 1,
  name: 'Ethereum',
  localStorageName: 'eth-mainnet',
  bridge: '0x12ed69359919fc775bc2674860e8fe2d2b6a7b5d',
  allowTokens: '0xA3FC98e0a7a979677BC14d541Be770b2cb0A15F3',
  federation: '0x5e29C223d99648C88610519f96E85E627b3ABe17',
  explorer: 'https://etherscan.io',
  explorerTokenTab: '#tokentxns',
  secondsPerBlock: 15,
  rpc: `https://mainnet.infura.io/v3/${process.env.VUE_APP_INFURA_KEY}`,
  v2UpdateBlock: 12871770,
  feePercentageDivider: 10_000,
  isRsk: false,
  isEth: true,
}
export const RSK_MAINNET_CONFIG = {
  networkId: 30,
  name: 'RSK Mainnet',
  localStorageName: 'rsk-mainnet',
  bridge: '0x9d11937e2179dc5270aa86a3f8143232d6da0e69',
  allowTokens: '0xcb789036894a83a008a2aa5b3c2dde41d0605a9a',
  federation: '0x7ecfda6072942577d36f939ad528b366b020004b',
  explorer: 'https://explorer.rsk.co',
  explorerTokenTab: '?__tab=tokens%20transfers',
  secondsPerBlock: 30,
  rpc: 'https://public-node.rsk.co',
  v2UpdateBlock: 3540341,
  feePercentageDivider: 10_000,
  crossToNetwork: ETH_CONFIG,
  isRsk: true,
  isEth: false,
}
ETH_CONFIG.crossToNetwork = RSK_MAINNET_CONFIG

export const NETWORKS = {
  31: RSK_TESTNET_CONFIG,
  30: RSK_MAINNET_CONFIG,
  4: RINKEBY_CONFIG,
  1: ETH_CONFIG,
}
