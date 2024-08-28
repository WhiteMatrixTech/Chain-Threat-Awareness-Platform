/*
 * @Description: 
 * @Author: didadida262
 * @Date: 2024-08-26 10:16:45
 * @LastEditors: didadida262
 * @LastEditTime: 2024-08-26 13:52:25
 */
const prettierConfig = require("@white-matrix/prettier-config");

module.exports = {
  ...prettierConfig,
  plugins: [require("prettier-plugin-tailwindcss")]
};
