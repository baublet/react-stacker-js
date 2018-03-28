const path = require('path'),
      webpack = require('webpack')

module.exports = {
  entry: path.resolve(__dirname, 'demo', 'demo.js'),
  output: {
    path: path.resolve(__dirname, 'demo'),
    filename: 'demo.min.js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: 'babel-loader'
      }
    ]
  },
}