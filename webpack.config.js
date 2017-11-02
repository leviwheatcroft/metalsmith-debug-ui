const webpack = require('webpack')
const path = require('path')
const baseDir = __dirname
const prodn = process.env.NODE_ENV === 'production'
console.log(`webpack ${prodn ? 'production' : 'development'} build`)
process.traceDeprecation = true

const config = {
  devtool: 'source-map',
  entry: path.resolve(baseDir, 'lib', 'client', 'client.js'),
  output: {
    path: path.resolve(baseDir, 'dist', 'client'),
    filename: 'client.js'
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {}
  },
  plugins: [
    // prodn ? new webpack.ProvidePlugin({
    //   React: 'react' // doesn't work
    // }) : false,
    prodn ? new webpack.optimize.UglifyJsPlugin({
      sourceMap: !prodn,
      compressor: {
        warnings: false
      }
    }) : false
  ].filter((e) => e),
  module: {
    loaders: [
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
      },
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' }
        ]
      }
    ]
  }
}

module.exports = config
