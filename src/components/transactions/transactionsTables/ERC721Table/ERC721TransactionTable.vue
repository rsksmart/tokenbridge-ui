<template>
  <thead>
    <tr>
      <th scope="col">Action</th>
      <th scope="col" width="12%">From</th>
      <th scope="col">Token Address</th>
      <th scope="col">Txn hash</th>
      <th scope="col">Block number</th>
      <th scope="col" width="13%">Token ID</th>
      <th scope="col" width="12%">To</th>
      <th scope="col">Receiver</th>
      <th scope="col" width="15%">Status</th>
    </tr>
  </thead>
  <tbody id="eth-rsk-tbody">
    <ERC721TransactionRow
      v-for="transaction in transactions"
      :key="transaction.transactionHash"
      :transaction="transaction"
      :types-limits="typesLimits"
      :rsk-confirmations="rskConfirmations"
      :side-confirmations="sideConfirmations"
      :rsk-block-number="rskBlockNumber"
      :side-block-number="sideBlockNumber"
      :rsk-fed-members="rskFedMembers"
      :side-fed-members="sideFedMembers"
    />
  </tbody>
</template>

<script>
import ERC721TransactionRow from './ERC721TransactionRow'
import TransactionTableMixin from '@/components/transactions/mixins/TransactionTableMixin'
export default {
  name: 'ERC721TransactionTable',
  components: { ERC721TransactionRow },
  mixins: [TransactionTableMixin],
}
</script>
