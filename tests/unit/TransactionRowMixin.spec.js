import { CROSSING_STEPS } from '@/constants/enums'
import { TEST_NET_SEPOLIA_CONFIG, TEST_NET_RSK_CROSS_SEPOLIA_CONFIG } from '@/constants/networks'
import ERC20TokenTransaction from '@/modules/transactions/transactionsTypes/ERC20TokenTransaction'
import {
  RECEIVER_ADDRESS,
  RSK_BLOCK_NUMBER,
  SENDER_ADDRESS,
  TRANSACTION_HASH,
  TUSD_TOKEN_SYMBOL,
  useTransactionRowMixinMock,
} from './mock/TransactionRowMixin.mock'
import { runAsync } from './utils/async.utils'
describe('TransactionRowMixin.js Test', () => {
  // SETUP
  beforeEach(() => {})

  // TEAR DOWN
  afterEach(() => {})

  it('given generic data into a Component with TransactionRowMixin when this component is created then all required field should be filled', () => {
    const transactionRowMixin = useTransactionRowMixinMock({
      computed: {
        fromNetwork() {
          return TEST_NET_RSK_CROSS_SEPOLIA_CONFIG
        },
        toNetwork() {
          return {
            isRsk: true,
            networkId: 1,
          }
        },
      },
      methods: {
        refreshStep: jest.fn(),
        getTokenTypeInstance() {
          return {
            transactionDataHashes: jest.fn().mockReturnValue(new ERC20TokenTransaction({})),
          }
        },
      },
    })
    expect(transactionRowMixin.vm.web3.defaultAccount).toBe(
      '0x840870aC9bB243cf30c1C4C8423dF1D0074D403C',
    )
    expect(transactionRowMixin.vm.transactionHashExplorerUrl).toBe(
      `${TEST_NET_RSK_CROSS_SEPOLIA_CONFIG.explorer}/tx/${TRANSACTION_HASH}`,
    )
    expect(transactionRowMixin.vm.isSenderNetwork).toBeFalsy()
    expect(transactionRowMixin.vm.isReceiverNetwork).toBeFalsy()
    expect(transactionRowMixin.vm.isSenderAddress).toBeFalsy()
    expect(transactionRowMixin.vm.isReceiverAddress).toBeFalsy()
    expect(transactionRowMixin.vm.senderAddressExplorerUrl).toBe(
      `${TEST_NET_RSK_CROSS_SEPOLIA_CONFIG.explorer}/address/${SENDER_ADDRESS}${TEST_NET_RSK_CROSS_SEPOLIA_CONFIG.explorerTokenTab}`,
    )
    expect(transactionRowMixin.vm.receiverAddressExplorerUrl).toBe(
      `${TEST_NET_SEPOLIA_CONFIG.explorer}/address/${RECEIVER_ADDRESS}${TEST_NET_SEPOLIA_CONFIG.explorerTokenTab}`,
    )
    expect(transactionRowMixin.vm.formattedTransactionHash).toBe('0xeba2...f8a30e')
    expect(transactionRowMixin.vm.formattedSenderAddress).toBe('0x39AC...C67572')
    expect(transactionRowMixin.vm.formattedReceiverAddress).toBe('0x2024...f15961')
    expect(transactionRowMixin.vm.latestBlock).toBe(RSK_BLOCK_NUMBER)
    expect(transactionRowMixin.vm.fedMembers).toStrictEqual([1])
    expect(transactionRowMixin.vm.txExplorerLink).toBe(
      `${TEST_NET_RSK_CROSS_SEPOLIA_CONFIG.explorer}/tx/${TRANSACTION_HASH}`,
    )
    expect(transactionRowMixin.vm.amountAndSymbol).toBe(`10000 ${TUSD_TOKEN_SYMBOL}`)
  })

  it('given fromNetwork TEST_NET_RSK_CROSS_SEPOLIA_CONFIG and toNetwork TEST_NET_SEPOLIA_CONFIG when Component is mounted then fromNetwork and toNetwork should be as expected', () => {
    const transactionRowMixin = useTransactionRowMixinMock({
      propsData: {
        transaction: {
          networkId: TEST_NET_RSK_CROSS_SEPOLIA_CONFIG.networkId,
          destinationChainId: TEST_NET_SEPOLIA_CONFIG.networkId,
        },
      },
      methods: {
        refreshStep: jest.fn(),
      },
    })

    runAsync().then(() => {
      expect(transactionRowMixin.vm.fromNetwork.name).toBe('RSK Testnet')
      expect(transactionRowMixin.vm.toNetwork.name).toBe('Sepolia')
    })
  })

  it('given currentStep equals ToClaim when refreshStep run then currentStep should be ToClaim', () => {
    const transactionRowMixin = useTransactionRowMixinMock({
      data() {
        return {
          currentStep: CROSSING_STEPS.ToClaim,
        }
      },
    })

    expect(transactionRowMixin.vm.currentStep).toBe(CROSSING_STEPS.ToClaim)
  })

  it('given currentStep Pending when refreshStep run then currentStep should be Claimed', () => {
    const transactionRowMixin = useTransactionRowMixinMock({
      propsData: {
        transaction: {
          blockNumber: 3,
        },
      },
      data() {
        return {
          currentStep: CROSSING_STEPS.Pending,
        }
      },
      computed: {
        fromNetwork() {
          return TEST_NET_RSK_CROSS_SEPOLIA_CONFIG
        },
        toNetwork() {
          return TEST_NET_SEPOLIA_CONFIG
        },
        latestBlock() {
          return 5
        },
        neededConfirmations() {
          return 7
        },
      },
    })

    runAsync().then(() => {
      expect(transactionRowMixin.vm.currentStep).toBe(CROSSING_STEPS.Claimed)
    })
  })

  it('given currentStep Voting when refreshStep run then currentStep should be Claimed', () => {
    const transactionRowMixin = useTransactionRowMixinMock({
      propsData: {
        transaction: {
          blockNumber: 99999999999,
          currentStep: CROSSING_STEPS.Voting,
        },
      },
      computed: {
        fromNetwork() {
          return TEST_NET_RSK_CROSS_SEPOLIA_CONFIG
        },
        toNetwork() {
          return TEST_NET_SEPOLIA_CONFIG
        },
        latestBlock() {
          return 5
        },
        neededConfirmations() {
          return 7
        },
      },
      methods: {
        getTokenTypeInstance() {
          return {
            transactionDataHashes: jest.fn().mockResolvedValue(TRANSACTION_HASH),
            claimed: jest.fn().mockResolvedValue(true),
          }
        },
      },
    })

    runAsync().then(() => {
      expect(transactionRowMixin.vm.currentStep).toBe(CROSSING_STEPS.Claimed)
    })
  })
})
