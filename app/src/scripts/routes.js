import React from 'react';

import { Router, Route, Redirect } from 'react-router';

import App from './App';
import HomePage from './pages/HomePage';
import Explore from './pages/Explore';
import MLModels from './pages/dashboard/MLModels';
import ModelTests from './pages/dashboard/ModelTests';
import TrainModel from './pages/TrainModel';
import ViewModel from './pages/ViewModel';
import TestModel from './pages/TestModel';
import ViewTest from './pages/ViewTest';
import InputData from './components/trainmodel/InputData';
import TrainingLabel from './components/trainmodel/TrainingLabel';
import ModelPreferences from './components/trainmodel/ModelPreferences';
import FAQ from './pages/FAQ';
import NotFound from './pages/NotFound';

import { fetchAuthenticatedUser } from './state/auth';
import { getAuthToken } from './utils';

export default function renderRoutes(store, history) {
  const requireAuth = (nextState, replace) => {
    const { auth } = store.getState();
    if (!auth.user) {
      replace({}, '/');
    }
  }

  const checkAuth = (nextState, replace, callback) => {
    const { auth } = store.getState();
    const { dispatch } = store;

    if (!auth.user) {
      const token = getAuthToken();
      if (token) {
        dispatch(fetchAuthenticatedUser(callback));
      } else {
        callback();
      }
    }
  }

  return (
    <Router history={history}>
      <Route component={App} onEnter={checkAuth}>
        <Route path="/" component={HomePage} />
        <Route path="/faq" component={FAQ}/>
        <Redirect from="/dashboard" to="/dashboard/models"/>
        <Route path="/dashboard" onEnter={requireAuth}>
          <Route path="models" component={MLModels}/>
          <Route path="tests" component={ModelTests}/>
        </Route>
        <Redirect from="/explore" to="/explore/models"/>
        <Route path="/explore">
          <Route path="(:itemType)" component={Explore}/>
        </Route>
        <Redirect from="/models/new" to="/models/new/input-data"/>
        <Route path="/models/new" component={TrainModel} onEnter={requireAuth}>
          <Route path="input-data" component={InputData}/>
          <Route path="training-label" component={TrainingLabel}/>
          <Route path="model-preferences" component={ModelPreferences}/>
        </Route>
        <Route path="/models/:id" component={ViewModel}/>
        <Route path="/tests/new" component={TestModel} onEnter={requireAuth}/>
        <Route path="/tests/:id" component={ViewTest}/>
        <Route path="*" component={NotFound}/>
      </Route>
    </Router>
  );
}
