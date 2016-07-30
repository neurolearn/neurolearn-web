import request from 'request';

import applyExpressMiddleware from '../lib/apply-express-middleware';
import _debug from 'debug';

const debug = _debug('app:server:multiproxy');

const API_HOST = 'localhost:3001';
const NEUROVAULT_HOST = 'neurovault.org';

const PROXY_URL_MAP = {
  '/nvproxy': nvApiProxy,
  '/api': appServerProxy,
  '/signin': appServerProxy,
  '/media': appServerProxy,
  '/static': appServerProxy,
  '/search': elasticSearchProxy
};

function appServerProxy(req) {
  const url = req.url;

  const proxied = request('http://' + API_HOST + url);
  proxied.on('error', function (err) {
    debug('Unable to proxy: ', url, err);
  });
  return proxied;
}

function nvApiProxy(req) {
  const nvproxy = req.url.match('^/nvproxy(/.+)');
  const url = nvproxy[1];

  const proxied = request('http://' + NEUROVAULT_HOST + url);
  proxied.on('error', function (err) {
    debug('Unable to proxy: ', url, err);
  });
  return proxied;
}

function elasticSearchProxy(req) {
  const proxied = request('http://localhost:9200/neurolearn/collection/_search');
  proxied.on('error', function (err) {
    debug('Unable to proxy: ', req.url, err);
  });
  return proxied;
}

function dispatchProxy(reqUrl) {
  for (const url in PROXY_URL_MAP) {
    if (PROXY_URL_MAP.hasOwnProperty(url)) {
      if (reqUrl.indexOf(url) === 0) {
        return PROXY_URL_MAP[url];
      }
    }
  }
  return null;
}

export default function () {
  debug('Enable multi host proxy middleware.');

  const middleware = (req, res, next) => {
    const proxied = dispatchProxy(req.url);

    if (proxied) {
      const proxiedRequest = proxied(req);
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
