
var webpack = require('webpack')

module.exports = {
  entry: {
    assets: ['./assets/main']
  },
  output: {
    path: __dirname + '/assets',
    filename: '[name].min.js'
  },
  externals: {
    // jquery: 'jQuery'
  },
  module: {
    loaders: [
        { test: /\.jade$/, loader: 'jade-loader' }
    ]
  },
  resolve: {
    modulesDirectories: [
      'node_modules'
    ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: false,
      mangle: true,
      output: {
        comments: false
      },
      compress: {
        warnings: false
      }
    })
  ]
}
