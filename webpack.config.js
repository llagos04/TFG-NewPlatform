const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const webpack = require("webpack");

module.exports = {
  entry: "./src/index.jsx",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    clean: true,
    assetModuleFilename: "assets/[hash][ext][query]", // Opcional: define carpeta para imágenes
  },
  resolve: {
    extensions: [".js", ".jsx", ".mjs"],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: "asset/resource", // Esto es equivalente a file-loader en Webpack 5+
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
    new webpack.DefinePlugin({
      "process.env.REACT_APP_API_URL": JSON.stringify(
        process.env.REACT_APP_API_URL
      ),
      "process.env.NODE_ENV": JSON.stringify(
        process.env.NODE_ENV || "development"
      ),
    }),
  ],
  devServer: {
    static: "./dist",
    port: 3000,
    proxy: [
      {
        context: ["/api"],
        target: "https://aeroassistant.test-by-neural.es:446",
        secure: false,
        changeOrigin: true,
        pathRewrite: { "^/api": "" },
      },
      {
        context: ["/transcribe"],
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    ],
    server: { type: "http" },
    hot: true,
    open: true,
    historyApiFallback: true,
  },

  mode: "development",
};
