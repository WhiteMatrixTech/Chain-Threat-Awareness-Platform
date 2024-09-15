/*
 * @Description:
 * @Author: didadida262
 * @Date: 2024-08-30 11:15:06
 * @LastEditors: didadida262
 * @LastEditTime: 2024-09-15 13:27:00
 */
/* eslint-disable prettier/prettier */
// eslint-disable-next-line prettier/prettier

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    textColor: {
      common: "#303133",
      disabled: "#929292"
    },
    backgroundColor: theme => ({
      ...theme("colors"),
      common: "#166CDD",
      themePrimary: "#2A6CB6"
    }),
    boxShadow: {
      card: "0px 4px 12px rgba(163, 174, 191, 0.2)"
    },
    extend: {
      screens: {
        xs: "300px",
        // => @media (min-width: 400px) { ... }

        // smm: '390px',
        // // iphone12pro
        // // => @media (min-width: 390px) { ... }

        sm: "640px",
        // => @media (min-width: 640px) { ... }

        md: "768px",
        // => @media (min-width: 768px) { ... }

        lg: "1024px",
        // => @media (min-width: 1024px) { ... }

        xl: "1280px",
        // => @media (min-width: 1280px) { ... }

        "1xl": "1380px",
        // => @media (min-width: 1380px) { ... }
        "2xl": "1440px",
        // => @media (min-width: 1440x820px) { ... }
        "3xl": "1920px",
        // '3xl': '1920x1080'
        // => @media (min-width: 1920px) { ... }
        "4xl": "2560px",
        // => @media (min-width: 2560x1440px) { ... }
        "5xl": "3840px"
        // => @media (min-width: 3840x2160px) { ... }
      }
    }
  },
  plugins: []
};
