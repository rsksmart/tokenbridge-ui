<template>
  <div class="mt-3">
    <div
      v-if="show"
      id="alert-danger"
      class="alert alert-danger alert-dismissible fade show"
      role="alert"
    >
      <h4 class="alert-heading">Ups! there was an error</h4>
      <p id="alert-danger-text">{{ error }}</p>
      <button type="button" class="close" aria-label="Close" @click="hide">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ErrorMsg',
  props: {
    error: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      show: false,
    }
  },
  watch: {
    error(value) {
      this.show = value ? true : false
    },
  },
  methods: {
    hide(event) {
      if (event) event.preventDefault()
      this.show = false
    },
  },
}
</script>
