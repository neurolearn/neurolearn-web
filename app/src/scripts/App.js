'use strict';

import React from 'react';
import SelectCollection from './SelectCollection';
import SelectTrainingLabel from './SelectTrainingLabel';
import RunAnalysisForm from './RunAnalysisForm';
import WeightMap from './WeightMap';

export default class App extends React.Component {
  handleRunAnalysis() {
    alert("sending a request to the server");
  }

  render() {
    return (
      <div className="app">
        <h1>Neurolearn</h1>
        <SelectCollection />
        <SelectTrainingLabel />
        <RunAnalysisForm onRunAnalysis={this.handleRunAnalysis}/>
        <WeightMap />
      </div>
    );
  }
}
