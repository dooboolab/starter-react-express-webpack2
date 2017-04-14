var webpack = require('webpack');
var path = require('path');

module.exports = {
  context: path.resolve(__dirname, './src'),
  entry: {
    app: './app.jsx'
  },
  output: {
    path: path.resolve(__dirname, './public'),
    filename: 'bundle.js'
  },
  resolve: {
    modules: [
      './node_modules',
      './src/components',
      './src/api'
    ],
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [
      { test: /\.scss$/, use: ['style-loader', 'css-loader', 'sass-loader']},
      {
        test: /\.jsx?$/,
        use: [{
          loader: 'babel-loader',
          options: { presets: ['react', 'es2015', 'stage-0'] },
        }],
        exclude: [/node_modules/, /bower_components/]
      }
    ]
  },
  devtool: 'cheap-module-eval-source-map'
};
