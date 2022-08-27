const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const {
  join,
  dirname
} = require('path')

const prodn = process.env.NODE_ENV === 'production'

const config = {
  // profile: true,
  // stats: 'detailed',
  mode: prodn ? 'production' : 'development',
  entry: join(__dirname, 'lib/client/client.js'),
  output: {
    path: join(__dirname, 'dist/client'),
    filename: 'client.js'
  },
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename]
    }
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
          join(__dirname, 'lib'),
          join(__dirname, 'lib/client'),
          join(__dirname, 'lib/client/Components')
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
        test: /\.css$/i,
        use: (info) => [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            // required when Rule.use is a function
            ident: 'css-loader',
            options: {
              url: false
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({ filename: '[name].css' })
  ],
  optimization: {
    ...prodn
      ? {
          minimizer: [
            '...',
            new CssMinimizerPlugin()
          ]
        }
      : {}
  }
}

module.exports = config
