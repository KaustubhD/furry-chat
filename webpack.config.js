const path = require('path')
// const nodeExternals = require('webpack-node-externals')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  entry: './client/client.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
    clean: true
  },
  // target: 'node',
  // externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: "babel-loader"
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        test: /\.(svg|gif|jpg|png|eot|woff|ttf|woff2)$/i,
        type: 'asset'
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'client.[contenthash].css',
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'client/assets', to: 'assets' }
      ]
    }),
    new HtmlWebpackPlugin({
      template: 'client/index.html',
      filename: 'index.html'
    })
  ]
}