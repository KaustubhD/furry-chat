const path = require('path')
const nodeExternals = require('webpack-node-externals')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")

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
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'client.css',
    })
  ]
}