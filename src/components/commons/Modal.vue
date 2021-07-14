<template>
  <div class="modal fade show" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <slot name="header">
            <h5 class="modal-title">
              <slot name="title">
                Modal title
              </slot>
            </h5>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
              @click="$emit('close')"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </slot>
        </div>
        <div class="modal-body">
          <slot name="body">
            <p>Modal body text goes here.</p>
          </slot>
        </div>
        <div class="modal-footer">
          <slot name="footer"> </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { store } from '@/store.js'

export default {
  name: 'Modal',
  components: {},
  emits: ['close'],
  data() {
    return {
      sharedState: store.state,
    }
  },
  methods: {
    connectWalletClick() {
      return store.handleLogin()
    },
  },
}
</script>
