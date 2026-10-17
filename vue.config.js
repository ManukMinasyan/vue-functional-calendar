const path = require('path')

module.exports = {
  runtimeCompiler: true,
  publicPath: '',
  css: {
    extract: false,
    loaderOptions: {
      sass: {
        implementation: require('sass')
      }
    }
  },
  outputDir: 'dist',
  filenameHashing: false,
  configureWebpack: {
    output: {
      libraryExport: 'default'
    },
    resolve: {
      alias: {
        '@': path.resolve('src')
      }
    }
  },
  lintOnSave: undefined
}
