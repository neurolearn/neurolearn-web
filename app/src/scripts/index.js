require('console-shim');
require('promise.prototype.finally');

require('index.css');
require('handsontable.full.css');

import React from 'react';
import App from './App';
import TrainModel from './pages/TrainModel';
import InputData from './components/InputData';
import TrainingLabel from './components/TrainingLabel';
import TestPatternMap from './pages/TestPatternMap';
import { Router, Route, Redirect } from 'react-router';
import { history } from 'react-router/lib/HashHistory';


React.render((
  <Router history={history}>
    <Route component={App}>
      <Route path="train-model" component={TrainModel}>
        <Route path="input-data" component={InputData}/>
        <Route path="training-label" component={TrainingLabel}/>
      </Route>
      <Route path="test-pattern-map" component={TestPatternMap}/>
    </Route>
    <Redirect from="/" to="train-model/input-data" />
  </Router>
), document.getElementById('root'));
