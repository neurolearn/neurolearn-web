var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');

var DEV_ROOT = 'build/dev';

new WebpackDevServer(webpack(config), {
  contentBase: DEV_ROOT,
  publicPath: config.output.publicPath,
  hot: true,
  historyApiFallback: true,      stats: {
        colors: true
      }

}).listen(3000, 'localhost', function (err, result) {
  if (err) {
    console.log(err);
  }

  console.log('Listening at localhost:3000');
});
