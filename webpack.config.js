const path = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");

const CopywebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  context: __dirname,
  entry: {
    app: "./app/main.ts",
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        loader: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.s?[ac]ss$/i,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.(png|gif|jpg|jpeg|svg|xml)$/,
        use: ["url-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "app/index.html",
    }),
    new CopywebpackPlugin({
      patterns: [
        {
          from: "app/assets/**/*",
          to: "assets/[name][ext]",
        },
      ],
    }),
  ],
  devServer: {
    static: path.join(__dirname, "dist"),
    hot: true,
  },
};
