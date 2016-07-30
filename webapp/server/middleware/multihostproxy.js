import request from 'request';

import applyExpressMiddleware from '../lib/apply-express-middleware';
import _debug from 'debug';

const debug = _debug('app:server:multiproxy');

const apiHost = 'localhost:3001';

function apiProxy(req) {
  var url = req.url;

  var proxied = request('http://' + apiHost + url);
  proxied.on('error', function (err) {
    console.log('Unable to proxy: ', url, err);
  });

  return proxied;
}

function nvApiProxy(req) {
  var nvproxy = req.url.match('^/nvproxy(/.+)');
  var url = nvproxy[1];
  var host = 'neurovault.org';

  var proxied = request('http://' + host + url);
  proxied.on('error', function (err) {
    console.log('Unable to proxy: ', url, err);
  });
  return proxied;
}

function elasticSearchProxy(req) {
  var proxied = request('http://localhost:9200/neurolearn/collection/_search');
  proxied.on('error', function (err) {
    console.log('Unable to proxy: ', req.url, err);
  });
  return proxied;
}

var proxyUrlMapping = {
  '/nvproxy': nvApiProxy,
  '/api': apiProxy,
  '/signin': apiProxy,
  '/media': apiProxy,
  '/static': apiProxy,
  '/search': elasticSearchProxy
};

function dispatchProxy(reqUrl) {
  var url;

  for (url in proxyUrlMapping) {
    if (proxyUrlMapping.hasOwnProperty(url)) {
      if (reqUrl.indexOf(url) === 0) {
        return proxyUrlMapping[url];
      }
    }
  }
  return null;
}

export default function () {
  debug('Enable multi host proxy middleware.');

  const middleware = (req, res, next) => {
    var proxied = dispatchProxy(req.url);

    if (proxied) {
      var proxiedRequest = proxied(req);
      req.pipe(proxiedRequest).pipe(res);
    } else {
      return next();
    }
  };

  return async function multiHostProxyMiddleware(ctx, next) {
    let hasNext = await applyExpressMiddleware(middleware, ctx.req, ctx.res);

    if (hasNext) {
      await next();
    }
  };
}
