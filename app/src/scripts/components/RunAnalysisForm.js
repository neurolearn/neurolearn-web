import React from 'react';
import classNames from 'classnames';

export default class RunAnalysisForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      submitEnabled: false
    };
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.onRunAnalysis(
      this.refs.algorithmInput.getDOMNode().value
    );
  }

  handleInputChange() {
    var enabled = (this.refs.algorithmInput.getDOMNode().value !== '');
    this.setState({
      submitEnabled: enabled
    });
  }

  render() {
    var classes = classNames({
      'btn': true,
      'btn-primary': true,
      'disabled': !this.state.submitEnabled
    });

    return (
      <form onSubmit={this.handleSubmit.bind(this)}>
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
        <button type="submit" className={classes}>Run Analysis</button>
      </form>
    );
  }
}
