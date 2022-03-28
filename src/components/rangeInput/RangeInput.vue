<template>
  <v-slider
    ref="rangeInput"
    v-model="currentValue"
    class="range-input"
    :tick-labels="labels"
    hide-details="true"
    :max="max"
    :min="min"
    thumb-color="var(--primary)"
    :step="step"
    :ticks="labels"
    show-ticks="always"
    :readonly="disabled"
    track-fill-color="var(--primary)"
    track-color="#B2B2B2"
  />
</template>

<script>
export default {
  name: 'RangeInput',
  props: {
    value: {
      type: Number,
      required: true,
    },
    min: {
      type: Number,
      default: 0,
    },
    max: {
      type: Number,
      default: 100,
    },
    step: {
      type: [Number, String],
      default: 1,
    },
    showMarks: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:value'],
  data() {
    return {
      marks: [],
      labels: {
        0: '0',
        25: '25',
        50: '50',
        75: '75',
        100: '100',
      },
    }
  },
  computed: {
    currentValue() {
      return this.value
    },
  },
  watch: {
    value(newPercentage) {
      this.$emit('update:value', newPercentage)
    },
  },
  mounted() {
    if (this.showMarks) {
      const numberOfMarks = (this.max - this.min) / this.step
      this.marks = Array(numberOfMarks)
        .fill(0)
        .map((value, index) => value + index * this.step)
    }
  },
}
</script>
<style scoped>
.range-input {
  margin-bottom: 0;
}
</style>
<style lang="scss" scoped>
$slider-vertical-margin-top: 2vh;
</style>
