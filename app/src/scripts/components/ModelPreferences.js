import { trim } from 'lodash';
import React, { PropTypes } from 'react';
import { Input } from 'react-bootstrap';
import classNames from 'classnames';

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

  constructor(props) {
    super(props);
    this.state = {
      modelName: '',
      submitEnabled: false
    };
  }

  handleSubmit(e) {
    e.preventDefault();
    this.handleTrainModelClick(
      this.refs.algorithmInput.getDOMNode().value
    );
  }

  handleInputChange() {
    const modelName = trim(this.refs.modelName.getValue());
    const algorithmInput = this.refs.algorithmInput.getDOMNode().value;

    const enabled = algorithmInput !== '' && modelName !== '';

    this.setState({
      submitEnabled: enabled,
      modelName: modelName
    });
  }

  handleTrainModelClick(algorithm) {
    const { router } = this.context;
    const modelName = this.state.modelName;
    const cv = {'kfolds': 5};
    this.props.dispatch(trainModel(modelName, algorithm, this.props.targetData, cv, router));
  }

  render() {
    var classes = classNames({
      'btn': true,
      'btn-primary': true,
      'disabled': !this.state.submitEnabled
    });

    return (
      <div>
        <h1 className="page-header">Model Preferences</h1>
        <div className="row">
          <div className="col-md-6">
            <form onSubmit={this.handleSubmit.bind(this)}>
              <div className="form-group">
                <Input type='text'
                       value={this.state.value}
                       onChange={this.handleInputChange.bind(this)}
                       ref='modelName'
                       label='Model Name'/>
              </div>
              <div className="form-group">
                <label>Select the type of an algorithm.</label>
                <select className="form-control"
                        ref="algorithmInput"
                        onChange={this.handleInputChange.bind(this)}
                        style={{marginRight: 10}}>
                  <option value="">Select an Algorithm</option>
                  <option value="svm">svm</option>
                  <option value="svr">svr</option>
                  <option value="ridge">ridge</option>
                </select>
              </div>
              <button type="submit" className={classes}>Train Model</button>
            </form>
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
