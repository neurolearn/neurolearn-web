/* @flow */

import React from 'react';

import { Route, Redirect } from 'react-router';

import App from '../App';
import Home from './Home';
import Explore from './Explore';
import ModelList from './Dashboard/ModelList';
import TestList from './Dashboard/TestList';
import ModelDetail from './ModelDetail';
import TestDetail from './TestDetail';
import NewModel from './NewModel';
import InputData from './NewModel/InputData';
import TrainingLabel from './NewModel/TrainingLabel';
import ModelPreferences from './NewModel/ModelPreferences';
import NewTest from './NewTest';
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
      <Route path="/models/new" component={NewModel} onEnter={requireAuth}>
        <Route path="input-data" component={InputData} />
        <Route path="training-label" component={TrainingLabel} />
        <Route path="model-preferences" component={ModelPreferences} />
      </Route>
      <Route path="/models/:id" component={ModelDetail} />
      <Route path="/tests/new" component={NewTest} onEnter={requireAuth} />
      <Route path="/tests/:id" component={TestDetail} />
      <Route path="*" component={NotFound} />
    </Route>
  );
}
