require('console-shim');
require('promise.prototype.finally');
require('bootstrap.css');
require('font-awesome.css');
require('index.css');
require('handsontable.full.css');

import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Redirect } from 'react-router';
import { history } from 'react-router/lib/HashHistory';
import { Provider } from 'react-redux';

import App from './App';
import HomePage from './pages/HomePage';
import Explore from './pages/Explore';
import MLModels from './pages/dashboard/MLModels';
import ModelTests from './pages/dashboard/ModelTests';
import TrainModel from './pages/TrainModel';
import ViewModel from './pages/ViewModel';
import TestModel from './pages/TestModel';
import ViewTest from './pages/ViewTest';
import InputData from './components/InputData';
import TrainingLabel from './components/TrainingLabel';
import ModelPreferences from './components/ModelPreferences';
import ExploreItems from './components/ExploreItems';
import configureStore from './store/configureStore';

const store = configureStore();

function renderRoutes(history) {
  return (
    <Router history={history}>
      <Route component={App}>
        <Route path="/" component={HomePage}/>
        <Route path="/dashboard/models" component={MLModels} />
        <Route path="/dashboard/tests" component={ModelTests} />
        <Redirect from="/explore" to="/explore/models" />
        <Route path="/explore" component={Explore}>
          <Route path="models" component={ExploreItems}/>
          <Route path="tests" component={ExploreItems}/>
        </Route>
        <Redirect from="/models/new" to="/models/new/input-data" />
        <Route path="/models/new" component={TrainModel}>
          <Route path="input-data" component={InputData}/>
          <Route path="training-label" component={TrainingLabel}/>
          <Route path="model-preferences" component={ModelPreferences}/>
        </Route>
        <Route path="/models/:id" component={ViewModel} />
        <Route path="/tests/new" component={TestModel} />
        <Route path="/tests/:id" component={ViewTest} />
      </Route>
    </Router>
  );
}

ReactDOM.render((
  <Provider store={store}>
    {() => renderRoutes(history)}
  </Provider>
), document.getElementById('root'));
