import React from 'react';
import { connect } from 'react-redux';
import SelectTrainingLabel from './SelectTrainingLabel';

import {
  loadImagesMetadata
} from '../actions';

export default class TrainingLabel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      targetData: null
    };
  }

  componentDidMount() {
    /*
      If only one collection is selected request NeuroVault for metadata
      Else Let the user upload his own data
    */
    const collectionId = 504;

    if (!this.props.imagesMetadata) {
      this.props.dispatch(loadImagesMetadata(collectionId));
    }
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

function select(state) {
  return state;
}

export default connect(select)(TrainingLabel);
