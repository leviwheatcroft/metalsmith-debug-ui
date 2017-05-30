const webpack = require('webpack')
const path = require('path')
const baseDir = __dirname
const prodn = process.env.NODE_ENV === 'production'
console.log(`webpack ${prodn ? 'production' : 'development'} build`)

const config = {
  devtool: prodn ? 'eval' : 'source-map',
  entry: path.resolve(baseDir, 'lib', 'client', 'client.js'),
  output: {
    path: path.resolve(baseDir, 'dist', 'client'),
    filename: 'client.js'
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {}
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        include: [
          path.resolve(baseDir, 'lib'),
          path.resolve(baseDir, 'lib', 'client'),
          path.resolve(baseDir, 'lib', 'client', 'Components')
        ],
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              'es2015',
              'react'
            ]
          }
        }
      }
    ]
  },
  plugins: [
    // prodn ? new webpack.ProvidePlugin({
    //   React: 'react' // doesn't work
    // }) : false,
    prodn ? new webpack.optimize.UglifyJsPlugin() : false
  ].filter((e) => (e))
}

module.exports = config
