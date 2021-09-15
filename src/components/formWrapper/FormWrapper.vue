<template>
  <div>
    <div>
      <button
        v-for="tab in tabs"
        :key="tab.label"
        :class="
          `btn mx-2 ${currentTab.label === tab.label ? 'btn-primary' : 'btn-outline-primary'}`
        "
        @click="currentTab = tab"
      >
        {{ tab.label }}
      </button>
    </div>
    <component
      :is="currentTabComponent"
      :types-limits="typesLimits"
      :rsk-fee="rskFee"
      :eth-fee="ethFee"
      :rsk-confirmations="rskConfirmations"
      :eth-confirmations="ethConfirmations"
      @new-transaction="handleNewTransaction"
    ></component>
  </div>
</template>

<script>
import formWrapperTabs, { tabsComponents } from '@/components/formWrapper/formWrapperTabs'

export default {
  name: 'FormWrapper',
  components: {
    ...tabsComponents,
  },
  props: {
    typesLimits: {
      type: Array,
      required: true,
    },
    rskFee: {
      type: Number,
      required: true,
    },
    ethFee: {
      type: Number,
      required: true,
    },
    rskConfirmations: {
      type: Object,
      required: true,
    },
    ethConfirmations: {
      type: Object,
      required: true,
    },
  },
  emits: ['newTransaction'],
  data() {
    return {
      tabs: formWrapperTabs,
      currentTab: formWrapperTabs[0],
    }
  },
  computed: {
    currentTabComponent() {
      return this.currentTab.component.name
    },
  },
  methods: {
    handleNewTransaction($event) {
      this.$emit('newTransaction', $event)
    },
  },
}
</script>

<style scoped></style>
