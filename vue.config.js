const path = require('path')

module.exports = {
  runtimeCompiler: true,
  publicPath: '',
  css: {
    extract: false
  },
  outputDir: 'dist',
  filenameHashing: false,
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve('src')
      }
    }
  },
  lintOnSave: undefined
}
