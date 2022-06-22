module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    textColor: {
      common: '#303133'
    },
    backgroundColor: (theme) => ({
      ...theme('colors'),
      common: '#166CDD'
    }),
    boxShadow: {
      card: '0px 4px 12px rgba(163, 174, 191, 0.2)'
    },
    extend: {}
  },
  plugins: []
};
