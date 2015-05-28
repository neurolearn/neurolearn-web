var path = require('path');
var webpack = require('webpack');

// nsviewer is from examples folder of neurosynth viewer repo:
// cat panzoom.js jquery.min.js xtk.js jquery-ui.min.js \
// bootstrap.min.js rainbow.js sylvester.js amplify.min.js \
// viewer.js > nsviewer.js

module.exports = {
  // devtool: 'eval',
  entry: [
    // 'webpack-dev-server/client?http://localhost:3000',
    // 'webpack/hot/only-dev-server',
    './src/scripts/index'
  ],
  output: {
    // path: path.join(__dirname, 'build'),
    // filename: 'bundle.js',
    // publicPath: '/scripts/'
    library: 'require',
    libraryTarget: 'this'
  },
  externals: {},
  plugins: [
    // new webpack.HotModuleReplacementPlugin(),
    // new webpack.NoErrorsPlugin()
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
      // { test: /\.jsx?$/, loaders: ['react-hot', 'babel'], include: path.join(__dirname, 'src/scripts') },
      { test: /\.jsx?$/, loader: 'babel', include: path.join(__dirname, 'src/scripts'), exclude: /node_modules|vendor_modules/ },
      { test: /vendor_modules\/handsontable.full.js$/, loader: 'imports?this=>window' },
      { test: /\.css$/, loader: 'style-loader!css-loader' }
    ],
    noParse: [
        /[\/\\]vendor_modules[\/\\]handsontable.full\.js$/,
        /[\/\\]vendor_modules[\/\\]nsviewer\.js$/
    ]
  }
};
