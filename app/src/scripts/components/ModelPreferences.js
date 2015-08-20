import React from 'react';
import RunAnalysisForm from './RunAnalysisForm';
import { connect } from 'react-redux';
import { trainModel } from '../actions';

export default class ModelPreferences extends React.Component {
  handleRunAnalysis(algorithm) {
    console.log(algorithm);
    // dispatch sending data to the server
    // redirect to a dashboard and show a task processing
    //
    this.props.dispatch(trainModel(this.props.targetData, algorithm));
  }

  render() {
    return (
      <div>
        <h1 className="page-header">Model Preferences</h1>
        <p className="lead">Select the type of algorithm.</p>
        <RunAnalysisForm onRunAnalysis={this.handleRunAnalysis.bind(this)}/>
      </div>
    );
  }
}

function select(state) {
  return state;
}

export default connect(select)(ModelPreferences);
