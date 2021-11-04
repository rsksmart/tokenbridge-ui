export function type(value) {
  if (value === undefined) {
    return 'Undefined'
  }
  if (value === null) {
    return 'Null'
  }
  return Object.prototype.toString.call(value).slice(8, -1)
}

export function isEmpty(value) {
  const typeValue = type(value)
  switch (typeValue) {
    case 'Array':
      return value.length === 0
    case 'Object':
      return Object.keys(value).length === 0
    case 'String':
      return value === ''
    default:
      return false
  }
}
