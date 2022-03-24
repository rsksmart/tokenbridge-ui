export const rules = {
  required: (value) => {
    if (!value || !value.length) {
      return 'This field is required'
    }

    return true
  },
}
