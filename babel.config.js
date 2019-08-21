// babel.config.js
module.exports = {
    presets: [
        "@babel/preset-env",
        ['@vue/app', {
            polyfills: [
                'es6.promise',
                'es6.symbol'
            ]
        }]
    ]
}
