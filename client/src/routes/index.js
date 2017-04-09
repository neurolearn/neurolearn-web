/* @flow */

import React from 'react';

import { Route, Redirect } from 'react-router';

import App from '../App';
import Home from './Home';
import Explore from './Explore';
import ModelList from './Dashboard/ModelList';
import TestList from './Dashboard/TestList';
import Model from './Model';
import Test from './Test';
import TrainModel from './TrainModel';
import InputData from './TrainModel/InputData';
import TrainingLabel from './TrainModel/TrainingLabel';
import ModelPreferences from './TrainModel/ModelPreferences';
import TestModel from './TestModel';
import FAQ from './FAQ';
import NotFound from '../components/NotFound';

import { fetchAuthenticatedUser } from '../state/auth';
import { getAuthToken } from '../utils';

export default function renderRoutes(store: Object) {
  const requireAuth = (nextState, replace) => {
    const { auth } = store.getState();
    if (!auth.user) {
      replace({}, '/');
    }
  };

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
  };

  return (
    <Route component={App} onEnter={checkAuth}>
      <Route path="/" component={Home} />
      <Route path="/faq" component={FAQ} />
      <Redirect from="/dashboard" to="/dashboard/models" />
      <Route path="/dashboard" onEnter={requireAuth}>
        <Route path="models" component={ModelList} />
        <Route path="tests" component={TestList} />
      </Route>
      <Redirect from="/explore" to="/explore/models" />
      <Route path="/explore">
        <Route path="(:itemType)" component={Explore} />
      </Route>
      <Redirect from="/models/new" to="/models/new/input-data" />
      <Route path="/models/new" component={TrainModel} onEnter={requireAuth}>
        <Route path="input-data" component={InputData} />
        <Route path="training-label" component={TrainingLabel} />
        <Route path="model-preferences" component={ModelPreferences} />
      </Route>
      <Route path="/models/:id" component={Model} />
      <Route path="/tests/new" component={TestModel} onEnter={requireAuth} />
      <Route path="/tests/:id" component={Test} />
      <Route path="*" component={NotFound} />
    </Route>
  );
}
