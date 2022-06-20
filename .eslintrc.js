module.exports = {
  plugins: ['simple-import-sort'],
  extends: [
    "@white-matrix/eslint-config",
  ],
  parserOptions: {
    requireConfigFile: false,
    project: require.resolve('./tsconfig.json')
  },
  rules: {
    '@typescript-eslint/explicit-module-boundary-types': 'off'
  }
};
