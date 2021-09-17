<template>
  <div class="bg-white p-2 rounded-sm">
    <div class="modal-header">
      <h4 class="m-0"><i class="fas fa-check-circle text-success"></i> {{ title }}</h4>
    </div>
    <div class="modal-body">
      <p v-html="message"></p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SuccessModal',
  props: {
    title: { type: String, default: 'Successful' },
    message: { type: String, required: true },
  },
}
</script>

<style scoped></style>
