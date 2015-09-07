import React from 'react';
import Step from './Step';

export default class Steps extends React.Component {
  static propTypes = {
    children: React.PropTypes.object
  };

  render() {
    return (
      <ul className="nav nav-wizard">
        <Step to="/models/new/input-data">1. Input Data</Step>
        <Step to="/models/new/training-label">2. Training Label</Step>
        <Step to="/models/new/model-preferences">3. Model Preferences</Step>
      </ul>
    );
  }
}


