import React from 'react';
import Step from './Step';

export default class Steps extends React.Component {
  static propTypes = {
    children: React.PropTypes.object
  };

  render() {
    return (
      <ul className="nav nav-wizard">
        <Step to="/train-model/input-data">1. Input Data</Step>
        <Step to="/train-model/training-label">2. Training Label</Step>
        <Step to="/train-model/model-preferences">3. Model Preferences</Step>
        <Step to="/train-model/review">4. Review</Step>
      </ul>
    );
  }
}


