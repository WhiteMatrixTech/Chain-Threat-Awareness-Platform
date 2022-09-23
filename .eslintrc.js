module.exports = {
  plugins: ['simple-import-sort'],
  extends: ['@white-matrix/eslint-config'],
  parserOptions: {
    requireConfigFile: false,
    project: require.resolve('./tsconfig.json')
  },
  rules: {
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'off',
    '@typescript-eslint/no-unnecessary-type-assertion': 'off',
    '@typescript-eslint/no-unsafe-return': 'off'
  }
};
