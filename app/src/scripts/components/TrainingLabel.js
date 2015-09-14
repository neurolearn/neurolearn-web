import isEmpty from 'lodash/lang/isEmpty';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import DataGrid from './DataGrid';
import Spinner from './Spinner';

import { loadImagesMetadata } from '../state/imagesMetadata';
import { setTargetData } from '../state/targetData';

export default class TrainingLabel extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    selectedImages: PropTypes.object,
    imagesMetadata: PropTypes.object
  };

  componentDidMount() {
    const { images } = this.props.selectedImages;
    const selectedCollectionIds = Object.keys(images).filter((collectionId) =>
      this.countSelectedImages(images[collectionId])
    );

    if (selectedCollectionIds.length === 1 && isEmpty(this.props.imagesMetadata.items)) {
      const collectionId = selectedCollectionIds[0];
      this.props.dispatch(loadImagesMetadata(collectionId, images[collectionId]));
    }
  }

  countSelectedImages(collection) {
    return Object.keys(collection).reduce((accum, key) =>
      collection[key] ? accum + 1 : accum,
    0);
  }

  handleTargetSelection(targetData) {
    this.props.dispatch(setTargetData(targetData));
  }

  prependRowWithColumnNames(data) {
    let firstRow = {};
    Object.keys(data[0]).map(key => firstRow[key] = key);
    return [firstRow].concat(data);
  }

  convertToArrayOfArrays(data) {
    console.log(data);
    const keys = Object.keys(data[0]);

    return [keys].concat(data.map(item => keys.map(key => item[key])));
  }

  renderDataGrid(imagesMetadata) {
    const data = this.convertToArrayOfArrays(imagesMetadata);
    return (
      <div>
        <p>Select image filenames and training labels. Right click a corresponding column for each.</p>
        <DataGrid onSelectTarget={this.handleTargetSelection.bind(this)} data={data} />
      </div>
    );
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.imagesMetadata !== this.props.imagesMetadata;
  }

  renderLoading() {
    return (
      <div className="row">
        <div className="col-md-12" >
          <div style={{'padding-top': 30, 'height': 30}}><Spinner opts={{position: 'relative'}}/></div>
          <div style={{'color': 'gray', 'margin': 40, 'text-align': 'center'}}>Loading image metadata…</div>
        </div>
      </div>
    );
  }

  render() {
    const { imagesMetadata } = this.props;
    return (
      <div>
        <h1 className="page-header">Training Label</h1>
        { imagesMetadata.isFetching && this.renderLoading() }
        { !isEmpty(this.props.imagesMetadata.items) &&
          this.renderDataGrid(this.props.imagesMetadata.items) }

        <hr/>
        <Link disabled={false} className="btn btn-primary continue-button" to="/models/new/model-preferences">Continue to Model Preferences</Link>
      </div>
    );
  }
}

function select(state) {
  return state;
}

export default connect(select)(TrainingLabel);
