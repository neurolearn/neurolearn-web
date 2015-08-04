require('console-shim');
require('promise.prototype.finally');

require('index.css');
require('handsontable.full.css');

import React from 'react';
import App from './App';
import HomePage from './pages/HomePage';
import TrainModel from './pages/TrainModel';
import InputData from './components/InputData';
import TrainingLabel from './components/TrainingLabel';
import ModelPreferences from './components/ModelPreferences';
import Review from './components/Review';
import TestPatternMap from './pages/TestPatternMap';
import { Router, Route, Redirect } from 'react-router';
import { history } from 'react-router/lib/HashHistory';


React.render((
  <Router history={history}>
    <Route component={App}>
      <Route path="/" component={HomePage}/>
      <Redirect from="/train-model" to="/train-model/input-data" />
      <Route path="train-model" component={TrainModel}>
        <Route path="input-data" component={InputData}/>
        <Route path="training-label" component={TrainingLabel}/>
        <Route path="model-preferences" component={ModelPreferences}/>
        <Route path="review" component={Review}/>
      </Route>
      <Route path="test-pattern-map" component={TestPatternMap}/>
    </Route>
  </Router>
), document.getElementById('root'));
