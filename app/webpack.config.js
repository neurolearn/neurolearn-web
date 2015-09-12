'use strict';

var path = require('path');

// nsviewer is from examples folder of neurosynth viewer repo:
// cat panzoom.js jquery.min.js xtk.js jquery-ui.min.js \
// bootstrap.min.js rainbow.js sylvester.js amplify.min.js \
// viewer.js > nsviewer.js

function vendorRegExpPath(filename) {
  return new RegExp('\/vendor_modules\/' + filename.replace(/\./g, '\\.') + '$');
}

module.exports = {
  entry: [
    './src/scripts/index'
  ],
  output: {
    library: 'require',
    libraryTarget: 'this'
  },
  externals: {},
  plugins: [],
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
      { test: /\.js$/, loader: 'babel', include: path.join(__dirname, 'src/scripts'), exclude: /node_modules|vendor_modules/ },
      { test: /vendor_modules\/handsontable.full.js$/, loader: 'imports?this=>window' },
      { test: /\.scss$/, loader: 'style-loader!css-loader?modules&localIdentName=[name]__[local]___[hash:base64:5]!postcss-loader!sass' },
      { test: /\.css$/, loader: 'style-loader!css-loader' },
      { test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192'}, // inline base64 URLs for <=8k images, direct URLs for the rest
      { test: /\.(otf|eot|svg|ttf|woff2?)$/, loader: 'file'}
    ],
    noParse: [
      'handsontable.full.js',
      'nsviewer.js',
      'parser.js',
      'ruleJS.js',
      'handsontable.formula.js'
    ].map(vendorRegExpPath)
  },
  postcss: [
    require('autoprefixer-core')
  ]
};
