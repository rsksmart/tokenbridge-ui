<template>
  <div class="mt-3">
    <div
      v-if="error"
      id="alert-danger"
      class="alert alert-danger alert-dismissible fade show"
      role="alert"
    >
      <h4 class="alert-heading">Ups! there was an error</h4>
      <p id="alert-danger-text">{{ error }}</p>
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
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
}
</script>
