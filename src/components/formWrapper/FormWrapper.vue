<template>
  <div>
    <div v-if="false">
      <button
        v-for="tab in tabs"
        :key="tab.label"
        :class="
          `btn mx-2 ${currentTab.label === tab.label ? 'btn-primary' : 'btn-outline-primary'}`
        "
        @click="changeTab(tab)"
      >
        {{ tab.label }}
      </button>
    </div>
    <component
      :is="currentTabComponent"
      :types-limits="typesLimits"
      :rsk-fee="rskFee"
      :side-fee="sideFee"
      :rsk-confirmations="rskConfirmations"
      :side-confirmations="sideConfirmations"
      @new-transaction="handleNewTransaction"
    ></component>
  </div>
</template>

<script>
import formWrapperTabs, { tabsComponents } from '@/components/formWrapper/formWrapperTabs'
import globalStore from '@/stores/global.store'

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
    sideFee: {
      type: Number,
      required: true,
    },
    rskConfirmations: {
      type: Object,
      required: true,
    },
    sideConfirmations: {
      type: Object,
      required: true,
    },
  },
  emits: ['newTransaction'],
  data() {
    return {
      tabs: formWrapperTabs,
      currentTab: formWrapperTabs[0],
      globalStore: globalStore.state,
    }
  },
  computed: {
    currentTabComponent() {
      return this.currentTab.component.name
    },
  },
  mounted() {
    this.currentTab = formWrapperTabs[0]
    this.globalStore.currentTokenType = this.currentTab.tokenType
  },
  methods: {
    handleNewTransaction($event) {
      this.$emit('newTransaction', $event)
    },
    changeTab(tab) {
      this.currentTab = tab
      this.globalStore.currentTokenType = this.currentTab.tokenType
    },
  },
}
</script>

<style scoped></style>
