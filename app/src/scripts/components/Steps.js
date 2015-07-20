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
        <li><a href="#">3. Model Preferences</a></li>
        <li><a href="#">4. Review</a></li>
      </ul>
    );
  }
}


