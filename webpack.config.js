const path = require('path')

module.exports = {
  mode: 'development',
  entry: './frontend/blog-main.js',
  output: {
    path: path.resolve(__dirname, 'public', 'assets', 'js'),
    filename: 'blog-bundle.js'
  },
  //Comment the block above and uncomment the block below to generate the landing page bundle
  /*
  entry: './frontend/landing-page-main.js',
  output: {
    path: path.resolve(__dirname, 'public', 'assets', 'js'),
    filename: 'bundle.js'
  },
  */
  module: {
    rules: [{
      exclude: /node_modules/,
      test: /\.js$/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/env']
        }
      }
    }]
  },
  devtool: 'source-map'
};
