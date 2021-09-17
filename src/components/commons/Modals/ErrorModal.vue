<template>
  <div class="bg-white p-2 rounded-sm">
    <div class="modal-header">
      <h4 class="m-0"><i class="fas fa-exclamation-triangle text-danger"></i> {{ title }}</h4>
    </div>
    <div class="modal-body">
      <p v-html="message"></p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ErrorModal',
  props: {
    title: { type: String, default: 'Unexpected Error' },
    message: { type: String, required: true },
  },
}
</script>

<style scoped></style>
