'use strict';

import React from 'react';
import SelectTrainingLabel from './SelectTrainingLabel';

export default class TrainingLabelPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      targetData: null
    };
  }

  handleTargetSelection(targetData) {
    console.log(targetData);
    this.targetData = targetData;
  }

  render() {
    return (
      <div className="panel panel-default">
        <div className="panel-heading">
          <h3 className="panel-title">Training Label</h3>
        </div>
        <div className="panel-body">
          <SelectTrainingLabel
            onSelectTarget={this.handleTargetSelection.bind(this)}
          />
        </div>
      </div>
    );
  }
}
