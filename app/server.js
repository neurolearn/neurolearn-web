'use strict';

var webpack = require('webpack'),
    WebpackDevServer = require('webpack-dev-server'),
    config = require('./webpack.config'),
    request = require('request'),
    DEV_ROOT = 'build/dev',
    apiHost = 'localhost:3001';

var server = new WebpackDevServer(webpack(config), {
  contentBase: DEV_ROOT,
  publicPath: config.output.publicPath,
  hot: true,
  stats: {
    colors: true
  }
});

server.listen(3000, 'localhost', function (err) {
  if (err) {
    console.log(err);
  }

  console.log('Listening at localhost:3000');
});

server.app.use(function apiHook(req, res, next) {
  if (req.url.indexOf('/nvproxy') === 0 ||
      req.url.indexOf('/analysis') === 0
    ) {

    var proxiedRequest = request('http://' + apiHost + req.url);
    proxiedRequest.on('error', function (err) {
      console.log('Unable to proxy: ', req.url, err);
    });

    req.pipe(proxiedRequest).pipe(res);
  } else {
    next();
  }
});
