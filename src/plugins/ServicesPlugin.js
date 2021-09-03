export default {
  install: (app, options) => {
    const servicesInstances = Object.keys(options).reduce(
      (instances, key) => ({
        ...instances,
        [key]: new options[key](),
      }),
      {},
    )
    app.provide('$services', servicesInstances)
  },
}
