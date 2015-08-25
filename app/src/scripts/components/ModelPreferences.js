import React, { PropTypes } from 'react';
import { Input } from 'react-bootstrap';
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
    const modelName = this.refs.modelName.getValue();
    this.props.dispatch(trainModel(this.props.targetData, algorithm, modelName, router));
  }

  render() {
    return (
      <div>
        <h1 className="page-header">Model Preferences</h1>
        <div className="row">
          <div className="col-md-6">
            <Input type='text'
                   ref='modelName'
                   label='Model Name'/>
            <RunAnalysisForm onRunAnalysis={this.handleRunAnalysis.bind(this)}/>
          </div>
        </div>
      </div>
    );
  }
}

function select(state) {
  return state;
}

export default connect(select)(ModelPreferences);
