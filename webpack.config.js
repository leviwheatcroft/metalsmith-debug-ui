const webpack = require('webpack')
const path = require('path')
const baseDir = __dirname

const config = {
  devtool: 'cheap-source-map',
  entry: path.resolve(baseDir, 'lib', 'client', 'client.js'),
  output: {
    path: path.resolve(baseDir, 'dist', 'client'),
    filename: 'client.js'
  },
  resolve: {
    alias: {
      // jquery: 'jquery/src/jquery' // ,
      // 'react-json-tree/lib': 'react-json-tree/lib',
      // 'react-json-tree': 'react-json-tree',
      // 'react': 'react'
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        include: [
          path.resolve(baseDir, 'lib'),
          path.resolve(baseDir, 'lib', 'client')
        ],
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
    // new webpack.ProvidePlugin({
    //   // $: 'jquery' // ,
    //   // jQuery: 'jquery',
    //   // jsonview: 'jsonview',
    //   // bootstrap: 'bootstrap'
    // }),
    // react needs to be built with NODE_ENV = 'production'
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    // new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false },
      output: { comments: false },
      sourceMap: true
    })
  ]
}

module.exports = config
