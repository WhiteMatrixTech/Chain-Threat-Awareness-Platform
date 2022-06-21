const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const CracoLessPlugin = require('craco-less');
const { CracoAliasPlugin } = require('react-app-alias');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

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
    },
    {
      plugin: MonacoWebpackPlugin,
      options: {
        languages: ['javascript', 'typescript', 'golang', 'solidity']
      }
    }
  ],
  webpack: {
    plugins: [
      new NodePolyfillPlugin({
        excludeAliases: ['console']
      })
    ]
  }
};
