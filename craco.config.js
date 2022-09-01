const path = require('path');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const CracoLessPlugin = require('craco-less');
const { CracoAliasPlugin } = require('react-app-alias');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

const MONACO_DIR = path.resolve(__dirname, './node_modules/monaco-editor');

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
          use: ['style-loader', 'css-loader']
        },
        {
          test: /\.ttf$/,
          include: MONACO_DIR,
          use: ['file-loader']
        }
      ]
    },
    plugins: [
      new NodePolyfillPlugin({
        excludeAliases: ['console']
      }),
      new MonacoWebpackPlugin()
    ]
  },

  devServer: {
    port: 8000,
    proxy: {
      '/chainthreat': {
        target: 'https://alpha.api.whitematrixdev.com/chainthreat',
        changeOrigin: true
      }
    }
  }
};
