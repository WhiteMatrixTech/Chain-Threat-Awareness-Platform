const prettierConfig = require('@white-matrix/prettier-config');

module.exports = {
  ...prettierConfig,
  plugins: [require('prettier-plugin-tailwindcss')],
};
