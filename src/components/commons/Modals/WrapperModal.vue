<template>
  <div
    v-if="isModalVisible"
    class="modal-wrapper fixed-top w-100 h-100 d-flex justify-content-center align-items-center"
  >
    <div class="modal-container mw-50">
      <button type="button" class="close mr-2" aria-label="Close" @click="handleCloseModal">
        <span aria-hidden="true">&times;</span>
      </button>
      <component :is="currentModal" v-bind="modalProps" @close-modal="handleCloseModal"></component>
    </div>
  </div>
</template>

<script>
import ErrorModal from '@/components/commons/Modals/ErrorModal'
import { shallowRef } from 'vue'
import SuccessModal from '@/components/commons/Modals/SuccessModal'

export default {
  name: 'WrapperModal',
  components: { ErrorModal, SuccessModal },
  data() {
    return {
      isModalVisible: false,
      modalType: 'error',
      modalTypes: {
        error: shallowRef(ErrorModal),
        success: shallowRef(SuccessModal),
      },
      customModalComponent: null,
      modalProps: {},
    }
  },
  computed: {
    currentModal() {
      return this.customModalComponent || this.modalTypes[this.modalType]
    },
  },
  methods: {
    handleCloseModal() {
      this.isModalVisible = false
    },
    showModal({
      type = 'error',
      options = {
        customModalComponent: null,
        showCloseIcon: true,
        closeUsingKey: false,
        modalProps: {},
      },
    }) {
      if (!this.isModalVisible) {
        this.modalType = type
        if (type === 'custom' && options.customModalComponent) {
          this.customModalComponent = options.customModalComponent
        }
        this.modalProps = options.modalProps

        this.isModalVisible = true
      }
    },
  },
}
</script>

<style scoped>
.modal-wrapper {
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-container {
  min-width: 360px;
  max-width: 450px;
}
</style>
