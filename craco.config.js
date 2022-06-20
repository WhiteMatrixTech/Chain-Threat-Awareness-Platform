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
