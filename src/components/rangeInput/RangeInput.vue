<template>
  <input
    ref="rangeInput"
    type="range"
    :min="min"
    :max="max"
    :step="step"
    :value="value"
    :disabled="disabled"
    list="input-range"
    class="range-input"
    @input="handleInputValue"
  />
  <datalist v-if="showMarks" id="input-range">
    <option v-for="mark in marks" :key="mark" :value="mark" :label="`${mark}%`"></option>
  </datalist>
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
    }
  },
  mounted() {
    if (this.showMarks) {
      const numberOfMarks = (this.max - this.min) / this.step
      this.marks = Array(numberOfMarks)
        .fill(0)
        .map((value, index) => value + index * this.step)
    }
    this.handleInputValue({ target: this.$refs.rangeInput })
  },
  methods: {
    handleInputValue($event) {
      const value = Number($event.target.value)
      $event.target.style.backgroundSize =
        ((value - this.min) * 100) / (this.max - this.min) + '% 100%'
      this.$emit('update:value', value)
    },
  },
}
</script>

<style scoped>
.range-input {
  -webkit-appearance: none;
  margin-right: 15px;
  width: 100%;
  height: 7px;
  border-radius: 5px;
  background-size: 70% 100%;
  background: rgba(0, 0, 0, 0.1) linear-gradient(var(--primary), var(--primary)) no-repeat;
}

/* Input Thumb */
.range-input::-webkit-slider-thumb {
  -webkit-appearance: none;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: var(--primary);
  cursor: ew-resize;
  box-shadow: 0 0 2px 0 #555;
  transition: background 0.3s ease-in-out;
}

.range-input::-webkit-slider-thumb:hover,
.range-input::-moz-range-thumb:hover,
.range-input::-ms-thumb:hover {
  background: var(--primary);
}

/* Input Track */
.range-input::-webkit-slider-runnable-track,
.range-input::-moz-range-track,
.range-input::-ms-track {
  -webkit-appearance: none;
  box-shadow: none;
  border: none;
  background: transparent;
}
</style>
