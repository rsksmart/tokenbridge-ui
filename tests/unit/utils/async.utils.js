export const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

export const runAsync = () => sleep(0)
