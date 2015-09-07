require('console-shim');
require('promise.prototype.finally');

require('index.css');
require('handsontable.full.css');

import React from 'react';
import { Router, Route, Redirect } from 'react-router';
import { history } from 'react-router/lib/HashHistory';
import { Provider } from 'react-redux';

import App from './App';
import HomePage from './pages/HomePage';
import Dashboard from './pages/Dashboard';
import TrainModel from './pages/TrainModel';
import InputData from './components/InputData';
import TrainingLabel from './components/TrainingLabel';
import ModelPreferences from './components/ModelPreferences';
import ViewModel from './pages/ViewModel';
import TestModel from './pages/TestModel';
import ViewTest from './pages/ViewTest';
import ModelTests from './pages/ModelTests';
import configureStore from './store/configureStore';

const store = configureStore();

function renderRoutes(history) {
  return (
    <Router history={history}>
      <Route component={App}>
        <Route path="/" component={HomePage}/>
        <Route path="/models" component={Dashboard} />
        <Redirect from="/models/new" to="/models/new/input-data" />
        <Route path="/models/new" component={TrainModel}>
          <Route path="input-data" component={InputData}/>
          <Route path="training-label" component={TrainingLabel}/>
          <Route path="model-preferences" component={ModelPreferences}/>
        </Route>
        <Route path="/models/:id" component={ViewModel} />
        <Route path="/tests" component={ModelTests} />
        <Route path="/tests/new" component={TestModel} />
        <Route path="/tests/:id" component={ViewTest} />
      </Route>
    </Router>
  );
}

React.render((
  <Provider store={store}>
    {() => renderRoutes(history)}
  </Provider>
), document.getElementById('root'));
