<template>
  <div
    v-if="isModalVisible"
    class="modal-wrapper fixed-top w-100 h-100 d-flex justify-content-center align-items-center"
  >
    <div class="modal-container mw-50" :class="modalSizeClass">
      <button type="button" class="close mr-2" aria-label="Close" @click="handleCloseModal">
        <span aria-hidden="true">&times;</span>
      </button>
      <component :is="currentModal" @close-modal="handleCloseModal"></component>
    </div>
  </div>
</template>

<script>
import ErrorModal from '@/components/commons/Modals/ErrorModal'
import { shallowRef, h } from 'vue'
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
      modalSize: '',
    }
  },
  computed: {
    currentModal() {
      return this.customModalComponent || this.modalTypes[this.modalType]
    },
    modalSizeClass() {
      return `modal-size-${this.modalSize || 'small'}`
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
        modalEvents: {},
        size: 'small',
      },
    }) {
      if (!this.isModalVisible) {
        this.modalType = type
        if (type === 'custom' && options.customModalComponent) {
          this.customModalComponent = h(options.customModalComponent, {
            ...options.modalProps,
            on: { ...options.modalEvents },
          })
          console.log('CMC', this.customModalComponent)
          // this.customModalComponent = shallowRef(options.customModalComponent)
        }
        this.modalProps = options.modalProps
        this.modalSize = options.size
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

.modal-container.modal-size-small {
  min-width: 360px;
  max-width: 450px;
}

.modal-container.modal-size-medium {
  min-width: 720px;
  max-width: 810px;
}

.modal-container.modal-size-large {
  min-width: 1024px;
  max-width: 1140px;
}
</style>
