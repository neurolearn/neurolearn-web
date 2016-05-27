require('console-shim');
require('bootstrap.css');
require('font-awesome.css');
require('index.css');
require('handsontable.full.css');
require('es6-promise').polyfill();

import React from 'react';
import render from 'react-dom';
import { browserHistory } from 'react-router'
import { Provider } from 'react-redux';
import {persistStore, autoRehydrate} from 'redux-persist';

import renderRoutes from './routes';

import configureStore from './store/configureStore';

const store = configureStore();
persistStore(store);

render.render((
  <Provider store={store}>
    {() => renderRoutes(store, browserHistory)}
  </Provider>
), document.getElementById('root'));
