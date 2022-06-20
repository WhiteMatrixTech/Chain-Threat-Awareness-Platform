module.exports = {
  plugins: ['stylelint-prettier'],
  extends: ['stylelint-prettier/recommended'],
  rules: {
    'prettier/prettier': true
  },
  overrides: [
    {
      files: ['**/*.less'],
      customSyntax: 'postcss-less',
      rules: {
        'prettier/prettier': true
      }
    }
  ]
};
