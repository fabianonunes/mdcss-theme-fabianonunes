
var webpack = require('webpack')
var path = require('path')

module.exports = {
  entry: {
    assets: ['./assets/main']
  },
  output: {
    path: path.join(__dirname, 'assets'),
    filename: '[name].min.js'
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
