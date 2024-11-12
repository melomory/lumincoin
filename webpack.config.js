const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/app.js",
  mode: "development",
  output: {
    filename: "app.js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "/",
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "public"),
    },
    compress: true,
    port: 9000,
    historyApiFallback: true,
  },
  module: {},
  plugins: [
    new HtmlWebpackPlugin({
      template: "src/index.html",
    }),
  ],
};
