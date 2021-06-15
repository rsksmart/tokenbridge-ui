const { version } = require('./package.json')

module.exports = {
  lintOnSave: false,
  configureWebpack: {
    output: {
      filename: `[name]-${version}.[hash].bundle.js`,
    },
  },
}
