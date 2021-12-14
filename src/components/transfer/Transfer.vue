<template>
  <div>{{ title }}</div>
</template>

<script>
export default {
  name: 'Transfer',
  props: {
    title: {
      type: String,
      required: true,
    },
  },
}
</script>

<style scoped></style>
