/*eslint-env node */

var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: {
    //'game': [ 'webpack-hot-middleware/client', './source/game/game.jsx' ],
    'editor': [
      'webpack/hot/dev-server',
      './source/editor/editor.js'
    ]
  },
  devtool: 'source-map',
  output: {
    filename: '[name].js',
    sourceMapFilename: '[name].js.map',
    publicPath: '/static/',
    // NOTE: Specifying this because webpack-dev-middleware requires `path` to be anything other than the default empty string
    path: '/'
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  resolve: {
    alias: {
      'freeze-tag': path.join(__dirname, 'source')
    },
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      loaders: [ 'babel' ],
      include: path.join(__dirname, 'source')
    }]
  }
};
