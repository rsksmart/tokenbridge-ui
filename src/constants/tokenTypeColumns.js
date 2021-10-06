import { TOKEN_TYPE_ERC_20, TOKEN_TYPE_ERC_721 } from '@/constants/tokenType'
import { wrappedFormat } from '@/utils'

export const tokenTypesColumns = {
  [TOKEN_TYPE_ERC_20]: [
    {
      title: 'From',
      key: 'from',
      render: (value, compRef) => {
        return `<span class="${compRef.isSenderNetwork ? 'bold' : ''}">${
          compRef.fromNetwork.name
        }</span>`
      },
    },
    {
      title: 'Sender',
      key: 'sender',
      render: (value, compRef) => {
        return `<a href="${compRef.senderAddressExplorerUrl}" class="${
          compRef.isSenderAddress ? 'bold' : ''
        }" target="_blank">
        ${compRef.formattedSenderAddress}
      </a>`
      },
    },
    {
      title: 'Txn Hash',
      key: 'transactionHash',
      showCopy: true,
      render: (value, compRef) => {
        return `<a href="${compRef.transactionHashExplorerUrl}" target="_blank">
        ${compRef.formattedTransactionHash}
      </a>`
      },
    },
    {
      title: 'Block number',
      key: 'blockNumber',
    },
    {
      title: 'Amount',
      key: 'amount',
      render(value, compRef) {
        return `${compRef.amountAndSymbol}`
      },
    },
    {
      title: 'To',
      key: 'to',
      render(value, compRef) {
        return `<span class="${compRef.isReceiverNetwork ? 'bold' : ''}">${
          compRef.toNetwork.name
        }</span>`
      },
    },
    {
      title: 'Receiver',
      key: 'receiver',
      render(value, compRef) {
        return `<a href="${compRef.receiverAddressExplorerUrl}" class="${
          compRef.isReceiverAddress ? 'bold' : ''
        }" target="_blank">
        ${compRef.formattedReceiverAddress}
      </a>`
      },
    },
  ],
  [TOKEN_TYPE_ERC_721]: [
    {
      title: 'From',
      key: 'from',
      render: (value, compRef) => {
        return `<span class="${compRef.isSenderNetwork ? 'bold' : ''}">${
          compRef.fromNetwork.name
        }</span>`
      },
    },
    {
      title: 'Token Address',
      key: 'senderAddress',
      showCopy: true,
      render(value, compRef) {
        return `<a href="${compRef.senderAddressExplorerUrl}" target="_blank">
        ${wrappedFormat(value)}
      </a>`
      },
    },
    {
      title: 'Txn Hash',
      key: 'transactionHash',
      showCopy: true,
      render(value, compRef) {
        return `<a href="${compRef.transactionHashExplorerUrl}" target="_blank">
        ${compRef.formattedTransactionHash}
      </a>`
      },
    },
    {
      title: 'Block number',
      key: 'blockNumber',
    },
    {
      title: 'Token ID',
      key: 'tokenId',
    },
    {
      title: 'To',
      key: 'to',
      render(value, compRef) {
        return `<span class="${compRef.isReceiverNetwork ? 'bold' : ''}">${
          compRef.toNetwork.name
        }</span>`
      },
    },
    {
      title: 'Receiver',
      key: 'receiver',
      render(value, compRef) {
        return `<a href="${compRef.receiverAddressExplorerUrl}" class="${
          compRef.isReceiverAddress ? 'bold' : ''
        }" target="_blank">
        ${compRef.formattedReceiverAddress}
      </a>`
      },
    },
  ],
}
