import React, { PropTypes } from 'react';
import RunAnalysisForm from './RunAnalysisForm';
import { connect } from 'react-redux';
import { trainModel } from '../actions';

export default class ModelPreferences extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    targetData: PropTypes.array
  }

  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  handleRunAnalysis(algorithm) {
    const { router } = this.context;
    this.props.dispatch(trainModel(this.props.targetData, algorithm, router));
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
