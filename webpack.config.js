const path = require('path')
const nodeExternals = require('webpack-node-externals')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  entry: { main: './client/client.js' },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[chunkhash].js'
  },
  target: 'node',
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.css$/,
        use:  [  'style-loader', MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        test: /\.(svg|gif|jpg|png|eot|woff|ttf|woff2)$/,
        loaders: [
          'url-loader'
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'client.[chunkhash].css',
    }),
    new CopyWebpackPlugin([
      { from: 'client/assets', to: 'assets' }
    ]),
    new HtmlWebpackPlugin({
      inject: false,
      hash: true,
      template: 'client/index.html',
      filename: 'index.html'
    })
  ]
}