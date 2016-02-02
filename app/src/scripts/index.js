require('console-shim');
require('promise.prototype.finally');
require('bootstrap.css');
require('font-awesome.css');
require('index.css');
require('handsontable.full.css');

import React from 'react';
import render from 'react-dom';
import { Router, match, browserHistory } from 'react-router'
import { Provider } from 'react-redux';
import { getPrefetchedData, getDeferredData} from 'react-fetcher';

import renderRoutes from './routes';

import configureStore from './store/configureStore';

const routes = renderRoutes();
const store = configureStore();

browserHistory.listen(location => {
  console.log('got location', location);
  match({routes, location}, (error, redirectLocation, renderProps) => {
    console.log('got match', error, redirectLocation, renderProps);
    if (redirectLocation) {
      history.replaceState({}, redirectLocation.pathname + redirectLocation.search)
      return
    }

    if (error) {
      console.error(error);
      return;
    }

    if (!renderProps) {
      return;
    }

    const components = renderProps.routes
      .map(route => route.component)
      .filter(component => component);

    // Define locals to be provided to all fetcher functions:
    const locals = {
      path: renderProps.location.pathname,
      query: renderProps.location.query,
      params: renderProps.params,

      // Allow fetcher functions to dispatch Redux actions:
      dispatch: store.dispatch
    };
    getPrefetchedData(components, locals)
    .then(() => getDeferredData(components, locals))
  });
})

render.render((
  <Provider store={store}>
    {() =>  <Router routes={routes} history={browserHistory}/>}
  </Provider>
), document.getElementById('root'));
