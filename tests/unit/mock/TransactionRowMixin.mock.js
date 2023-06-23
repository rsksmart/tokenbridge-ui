import TransactionRowMixin from '@/components/transactions/mixins/TransactionRowMixin'
import { TEST_NET_RSK_CROSS_SEPOLIA_CONFIG } from '@/constants/networks'
import { shallowMount } from '@vue/test-utils'
import _ from 'lodash'

export const TEST_NET_SEPOLIA_ID = parseInt(process.env.VUE_APP_SIDE_CHAIN_ID)

export const typesLimitsMock = [
  [
    '100000000000000',
    '25000000000000000000',
    '100000000000000000000',
    '10000000000000000',
    '100000000000000000',
  ],
  [
    '500000000000000',
    '750000000000000000000',
    '3000000000000000000000',
    '30000000000000000',
    '300000000000000000',
  ],
  [
    '1000000000000000',
    '2500000000000000000000',
    '5000000000000000000000',
    '10000000000000000',
    '100000000000000000',
  ],
  [
    '100000000000000000',
    '25000000000000000000000',
    '50000000000000000000000',
    '1000000000000000000',
    '10000000000000000000',
  ],
  [
    '1000000000000000000',
    '2500000000000000000000000',
    '5000000000000000000000000',
    '10000000000000000000',
    '100000000000000000000',
  ],
  [
    '10000000000000000000',
    '250000000000000000000000000',
    '500000000000000000000000000',
    '100000000000000000000',
    '1000000000000000000000',
  ],
  [
    '10000000000000000000',
    '25000000000000000000000000000',
    '50000000000000000000000000000',
    '100000000000000000000',
    '1000000000000000000000',
  ],
]

export const TRANSACTION_HASH = '0xeba2df809e7a612a0a0d444ccfa5c839624bdc00dd29e3340d46df3870f8a30e'

export const SENDER_ADDRESS = '0x39AC2e40a09192D1e96FB798B0D6bb7EC8C67572'

export const RECEIVER_ADDRESS = '0x20246256AEB8eF33eAB258afb966b2F199f15961'

export const RSK_BLOCK_NUMBER = 1

export const SIDE_BLOCK_NUMBER = 2

export const TUSD_TOKEN_SYMBOL = 'rKovTUSD'

export const BLOCK_NUMBER = '0x18c52FAC35548D595F2f3b7640782eeB4b39896E'

export const RECEIVE_AMOUNT = '10000'

export const DEFAULT_TRANSACTION = {
  receiverAddress: RECEIVER_ADDRESS,
  blockNumber: BLOCK_NUMBER,
  transactionHash: TRANSACTION_HASH,
  senderAddress: SENDER_ADDRESS,
  tokenFrom: TUSD_TOKEN_SYMBOL,
  tokenTo: TUSD_TOKEN_SYMBOL,
  receiveAmount: RECEIVE_AMOUNT,
}

const defaultProps = {
  transaction: DEFAULT_TRANSACTION,
  typesLimits: typesLimitsMock,
  rskConfirmations: {
    smallAmount: '2',
    smallAmountTime: 'a minute',
    mediumAmount: '4',
    mediumAmountTime: '2 minutes',
    largeAmount: '10',
    largeAmountTime: '5 minutes',
  },
  sideConfirmations: {
    smallAmount: '2',
    smallAmountTime: 'a minute',
    mediumAmount: '4',
    mediumAmountTime: '2 minutes',
    largeAmount: '10',
    largeAmountTime: '5 minutes',
  },
  rskBlockNumber: RSK_BLOCK_NUMBER,
  sideBlockNumber: SIDE_BLOCK_NUMBER,
  rskFedMembers: [1],
  sideFedMembers: [2],
}
const defaultParams = {
  propsData: defaultProps,
  data() {
    return {
      sharedState: {
        rskWeb3: {
          defaultAccount: '0x840870aC9bB243cf30c1C4C8423dF1D0074D403C',
        },
        sideWeb3: {
          defaultAccount: '0xCD9Fe961b7bd1b92EDA518077a349e2376a3a19a',
        },
        currentConfig: {
          networkId: TEST_NET_SEPOLIA_ID,
          explorer: TEST_NET_RSK_CROSS_SEPOLIA_CONFIG.explorer,
        },
        accountAddress: SENDER_ADDRESS,
      },
      claimTxHash: TRANSACTION_HASH,
    }
  },

  global: {
    provide: {
      $services: {
        TransactionService: {
          saveTransaction: jest.fn(),
        },
      },
      $modal: {},
    },
  },
}

export const useTransactionRowMixinMock = (params = {}) => {
  const Component = {
    render() {},
    mixins: [TransactionRowMixin],
  }

  const wrapper = shallowMount(Component, _.merge(defaultParams, params))

  return wrapper
}
