<template>
  <h3>claimed on erc20 tx table: {{ claimed }}</h3>
  <thead>
    <tr>
      <th scope="col">Action</th>
      <th scope="col" width="12%">From</th>
      <th scope="col">Sender</th>
      <th scope="col">Txn hash</th>
      <th scope="col">Block number</th>
      <th scope="col" width="13%">Amount</th>
      <th scope="col" width="12%">To</th>
      <th scope="col">Receiver</th>
      <th scope="col" width="15%">Status</th>
    </tr>
  </thead>
  <tbody id="eth-rsk-tbody">
    <ERC20TransactionRow
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
      :emit-claim="emitClaim"
      :claimed="claimed"
    />
  </tbody>
</template>

<script>
import ERC20TransactionRow from '@/components/transactions/transactionsTables/ERC20Table/ERC20TransactionRow'
import TransactionTableMixin from '@/components/transactions/mixins/TransactionTableMixin'
export default {
  name: 'ERC20TransactionTable',
  components: { ERC20TransactionRow },
  mixins: [TransactionTableMixin],
}
</script>
