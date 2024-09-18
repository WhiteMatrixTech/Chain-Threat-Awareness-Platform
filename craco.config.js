/* eslint-disable prettier/prettier */
/*
 * @Description:
 * @Author: didadida262
 * @Date: 2024-08-26 10:16:45
 * @LastEditors: didadida262
 * @LastEditTime: 2024-09-18 10:44:22
 */
const path = require("path");
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");
const CracoLessPlugin = require("craco-less");
const { CracoAliasPlugin } = require("react-app-alias");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

const MONACO_DIR = path.resolve(__dirname, "./node_modules/monaco-editor");

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {},
            javascriptEnabled: true
          }
        }
      }
    },
    {
      plugin: CracoAliasPlugin,
      options: {}
    }
  ],
  webpack: {
    module: {
      rules: [
        {
          test: /\.css$/,
          include: MONACO_DIR,
          use: ["style-loader", "css-loader"]
        },
        {
          test: /\.ttf$/,
          include: MONACO_DIR,
          use: ["file-loader"]
        }
      ]
    },
    plugins: [
      new NodePolyfillPlugin({
        excludeAliases: ["console"]
      }),
      new MonacoWebpackPlugin()
    ],
    configure: {
      optimization: {
        usedExports: true,
        // 启用标准的Tree Shaking，并且确保不移除import时的__importDefault和__importStar
        concatenateModules: true
      }
    }
  },

  devServer: {
    port: 8000
    /* proxy: {
      '/chainthreat': {
        target: 'https://alpha.api.whitematrixdev.com/chainthreat',
        changeOrigin: true
      }
    } */
  }
};
