import React from 'react';
import RunAnalysisForm from './RunAnalysisForm';

export default class ModelPreferences extends React.Component {
  render() {
    return (
      <div>
        <h1 className="page-header">Model Preferences</h1>
        <p className="lead">Select the type of algorithm.</p>
        <RunAnalysisForm />
      </div>
    );
  }
}
