const CopyPlugin = require('copy-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const { join, resolve } = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const {
  WebpackBundleSizeAnalyzerPlugin
} = require('webpack-bundle-size-analyzer')

const prodn = process.env.NODE_ENV === 'production'

module.exports = {
  // profile: true,
  // stats: 'detailed',
  mode: prodn ? 'production' : 'development',
  devtool: 'source-map',
  entry: './client/index.js',
  target: 'web',
  output: {
    path: prodn
      ? join(process.cwd(), 'build')
      : join(process.cwd(), 'build/debug-ui'),
    filename: 'index.js'
  },
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename]
    }
  },
  module: {
    rules: [
      {
        test: /\.pug$/,
        loader: 'pug-plain-loader'
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              url: false
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  [
                    'postcss-preset-env',
                    {}
                  ],
                  [
                    'tailwindcss',
                    {
                      content: [
                        join(process.cwd(), 'client/components/**/*.pug'),
                        join(process.cwd(), 'client/components/**/*.vue')
                      ]
                    }
                  ]
                ]
              }
            }
          }
        ]
      }
    ]
  },
  plugins: [
    ...prodn ? [] : [new WebpackBundleSizeAnalyzerPlugin('./sizeAnalyzer.txt')],
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: prodn ? '"production"' : '"development"'
      }
    }),
    new MiniCssExtractPlugin(),
    new CopyPlugin({
      patterns: [
        {
          from: 'client/icons/',
          to: './'
        },
        ...prodn
          ? []
          : [
              {
                from: 'client/assets/snapshots.json',
                to: './'
              },
              {
                from: 'client/assets/build.log',
                to: './'
              }
            ]
      ]
    }),
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      template: 'client/assets/index.html',
      filename: prodn
        ? resolve(__dirname, 'build/index.html')
        : resolve(__dirname, 'build/debug-ui/index.html'),
      publicPath: '/debug-ui/'
    })
  ],
  resolve: {
    alias: {},
    extensions: ['.js', '.less', '.html', '.vue', '.gql'],
    mainFiles: ['index', '_index']
  },
  watchOptions: {
    aggregateTimeout: 200,
    ignored: /node_modules/
  }
}
