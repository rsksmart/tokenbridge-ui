<template>
  <v-slider ref="rangeInput" v-model="value" :tick-labels="labels" :max="max" :min="min" thumb-color="green"
            :step="step" :ticks="labels" show-ticks="always" tick-size="4" :disabled="disabled" track-fill-color="green" track-color="grey"
            @change="handleInputValue"/>
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
  mounted() {
    if (this.showMarks) {
      const numberOfMarks = (this.max - this.min) / this.step
      this.marks = Array(numberOfMarks)
        .fill(0)
        .map((value, index) => value + index * this.step)
    }
    // this.handleInputValue({ target: this.$refs.rangeInput })
  },
  methods: {
    handleInputValue(value) {

      console.log(value)
      $event.target.style.backgroundSize =
        ((value - this.min) * 100) / (this.max - this.min) + '% 100%'
      this.$emit('update:value', value)
    },
  },
}
</script>

<style scoped>
/* .range-input {
  -webkit-appearance: none;
  margin-right: 15px;
  width: 100%;
  height: 7px;
  top: 50%;
  border-radius: 5px;
  background-size: 70% 100%;
  background: rgba(0, 0, 0, 0.1) linear-gradient(var(--primary), var(--primary)) no-repeat;
} */

/* Input Thumb */
/* .v-slider-thumb {
  -webkit-appearance: none;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: var(--primary);
  cursor: ew-resize;
  box-shadow: 0 0 2px 0 #555;
  transition: background 0.3s ease-in-out;
} */

/* .range-input::-webkit-slider-thumb:hover,
.range-input::-moz-range-thumb:hover,
.range-input::-ms-thumb:hover {
  background: var(--primary);
} */

/* Input Track */
/* .range-input::-webkit-slider-runnable-track,
.range-input::-moz-range-track,
.range-input::-ms-track {
  -webkit-appearance: none;
  box-shadow: none;
  border: none;
  background: transparent;
} */
</style>
<style lang="scss" scoped>
$slider-vertical-margin-top: 2vh;
$slider-thumb-focused-size-increase: undefined !important;
</style>