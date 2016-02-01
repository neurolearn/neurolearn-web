require('console-shim');
require('promise.prototype.finally');
require('bootstrap.css');
require('font-awesome.css');
require('index.css');
require('handsontable.full.css');

import React from 'react';
import render from 'react-dom';
import { hashHistory } from 'react-router'
import { Provider } from 'react-redux';

import renderRoutes from './routes';

import configureStore from './store/configureStore';

const store = configureStore();

render.render((
  <Provider store={store}>
    {() => renderRoutes(hashHistory)}
  </Provider>
), document.getElementById('root'));
