// module.exports = {
//   plugins: {
//     tailwindcss: {},
//     autoprefixer: {},
//     'postcss-nested': {},
//     'postcss-pxtorem': {
//       rootValue: 10,
//       unitPrecision: 5,
//       propList: ['*'],
//       mediaQuery: false,
//       minPixelValue: 2,
//       exclude: (file) => {
//         return file.includes('node_modules') || file.includes('antd.custom.css');
//       },
//     },
//   },
// };

module.exports = {
  plugins: {
    'postcss-import': {},
    'tailwindcss/nesting': {},
    tailwindcss: {},
    autoprefixer: {},
  },
};
