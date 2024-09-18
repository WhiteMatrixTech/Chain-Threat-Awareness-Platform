/* eslint-disable prettier/prettier */
/*
 * @Description:
 * @Author: didadida262
 * @Date: 2024-08-26 10:16:45
 * @LastEditors: didadida262
 * @LastEditTime: 2024-09-18 11:36:02
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
        usedExports: true, // 开启只导出被使用的代码
        sideEffects: true, // 开启副作用标记，用于更好的 Tree Shaking
        concatenateModules: true // 开启模块合并
        // splitChunks: {
        //   cacheGroups: {
        //     default: false,
        //     vendors: false,
        //     // 将第三方库单独打包
        //     vendor: {
        //       chunks: "all",
        //       test: /node_modules/,
        //       name: "vendor",
        //       enforce: true
        //     }
        //   }
        // }
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
