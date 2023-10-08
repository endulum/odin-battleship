const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader", "postcss-loader"],
      }
    ]
  },
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      // title: 'Hello, World',
      favicon: './src/favicon.ico',
    })
  ],
  devtool: 'inline-source-map',
  devServer: {
    static: './dist',
    hot: true,
  },
}