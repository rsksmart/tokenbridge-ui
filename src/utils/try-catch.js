const checkFunction = fn => {
  if (typeof fn !== 'function') {
    throw new Error('First argument should be a function')
  }
}

export const tryCatch = (fn, ...args) => {
  checkFunction(fn)
  try {
    return [null, fn(...args)]
  } catch (e) {
    return [e]
  }
}

export const asyncTryCatch = async (fn, ...args) => {
  checkFunction(fn)
  try {
    return [null, await fn(...args)]
  } catch (e) {
    return [e]
  }
}
