<template>
  <v-slider ref="rangeInput" 
    v-model="value" 
    :tick-labels="labels" 
    :max="max" 
    :min="min" 
    thumb-color="green"
    :step="step" 
    :ticks="labels" 
    show-ticks="always" 
    :disabled="disabled" 
    track-fill-color="green" 
    track-color="grey" />
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

<style lang="scss" scoped>
$slider-vertical-margin-top: 2vh;
$slider-thumb-focused-size-increase: undefined !important;
</style>