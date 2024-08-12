// webpack.config.js
module.exports = {
    module: {
      rules: [
        // other rules
        {
          test: /\.glsl$/,
          use: 'webpack-glsl-loader'
        }
      ]
    }
  };
  