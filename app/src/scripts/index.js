require('console-shim');
require('promise.prototype.finally');
require('bootstrap.css');
require('font-awesome.css');
require('index.css');
require('handsontable.full.css');

import React from 'react';
import ReactDOM from 'react-dom';
import { history } from 'react-router/lib/HashHistory';
import { Provider } from 'react-redux';

import renderRoutes from './routes';

import configureStore from './store/configureStore';

const store = configureStore();

ReactDOM.render((
  <Provider store={store}>
    {() => renderRoutes(history)}
  </Provider>
), document.getElementById('root'));
