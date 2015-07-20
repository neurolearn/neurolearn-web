import React from 'react';
import SelectTrainingLabel from './SelectTrainingLabel';

export default class TrainingLabel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      targetData: null
    };
  }

  handleTargetSelection(targetData) {
    console.log(targetData);
    this.targetData = targetData;
  }

  render() {
    return (
      <div>
        <h1 className="page-header">Training Label</h1>
        <p className="lead">Upload a CSV file with metadata for this collection. <em>Try using <a href="/static/data/Pain_Trial_Data.csv">example metadata</a> for collection #504</em>.</p>

        <SelectTrainingLabel
            onSelectTarget={this.handleTargetSelection.bind(this)}
          />
      </div>
    );
  }
}
