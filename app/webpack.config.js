var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'eval',
  entry: [
    'webpack-dev-server/client?http://localhost:3000',
    'webpack/hot/only-dev-server',
    './src/scripts/index'
  ],
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'bundle.js',
    publicPath: '/scripts/'
  },
  externals: {},
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  resolve: {
    modulesDirectories: [
      'node_modules',
      'vendor_modules',
      'src/scripts',
      'src/styles'
    ],
    alias: {
      'handsontable': 'handsontable.full.js'
    },
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [
      { test: /\.jsx?$/, loaders: ['react-hot', 'babel'], include: path.join(__dirname, 'src/scripts') },
      { test: /vendor_modules\/handsontable.full.js$/, loader: 'imports?this=>window' },
      { test: /\.css$/, loader: 'style-loader!css-loader'}
    ],
    noParse: [
        /[\/\\]vendor_modules[\/\\]handsontable.full\.js$/
    ]
  }
};
