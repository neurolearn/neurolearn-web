import isEmpty from 'lodash/lang/isEmpty';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import SelectTrainingLabel from './SelectTrainingLabel';
import DataGrid from './DataGrid';

import {
  loadImagesMetadata
} from '../actions';

export default class TrainingLabel extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired
  };

  componentDidMount() {
    /*
      If only one collection is selected request NeuroVault for metadata
      Else Let the user upload his own data
    */
    const { images } = this.props.selectedImages;
    const selectedCollectionIds = Object.keys(images).filter((collectionId) =>
      this.countSelectedImages(images[collectionId])
    );

    if (selectedCollectionIds.length === 1 && isEmpty(this.props.imagesMetadata)) {
      this.props.dispatch(loadImagesMetadata(selectedCollectionIds[0]));
    }
  }

  countSelectedImages(collection) {
    return Object.keys(collection).reduce((accum, key) =>
      collection[key] ? accum + 1 : accum,
    0);
  }

  handleTargetSelection(targetData) {
    console.log(targetData);
    this.targetData = targetData;
  }

  renderUploadAndSelect() {
    return (
      <div>
       <p className="lead">Upload a CSV file with metadata for this collection. <em>Try using <a href="/static/data/Pain_Trial_Data.csv">example metadata</a> for collection #504</em>.</p>
        <SelectTrainingLabel onSelectTarget={this.handleTargetSelection.bind(this)} />
      </div>
    );
  }

  prependRowWithColumnNames(data) {
    let firstRow = {};
    Object.keys(data[0]).map(key => firstRow[key] = key);
    return [firstRow].concat(data);
  }

  renderDataGrid(imagesMetadata) {
    return (
      <div>
        <p>Select image filenames and training labels. Right click a corresponding column for each.</p>
        <DataGrid onSelectTarget={this.handleTargetSelection.bind(this)} data={this.prependRowWithColumnNames(imagesMetadata)} />
      </div>
    );
  }

  render() {
    return (
      <div>
        <h1 className="page-header">Training Label</h1>

        { isEmpty(this.props.imagesMetadata)
          ? this.renderUploadAndSelect()
          : this.renderDataGrid(this.props.imagesMetadata)
        }

        <hr/>
        <Link disabled={false} className="btn btn-primary continue-button" to="/train-model/model-preferences">Continue to Model Preferences</Link>
      </div>
    );
  }
}

function select(state) {
  return state;
}

export default connect(select)(TrainingLabel);
