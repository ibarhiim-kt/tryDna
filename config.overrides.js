const { override, addWebpackModuleRule } = require('customize-cra');

module.exports = override(
  addWebpackModuleRule({
    test: /\.glsl$/,
    use: 'webpack-glsl-loader',
  })
);
