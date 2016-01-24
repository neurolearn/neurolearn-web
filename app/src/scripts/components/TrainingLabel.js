import { isEmpty, pick } from 'lodash';
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
    imagesMetadata: PropTypes.object,
    targetData: PropTypes.object
  };

  componentDidMount() {
    const images = pick(this.props.selectedImages.images,
                        this.countSelectedImages);
    if (!isEmpty(Object.keys(images))
        && isEmpty(this.props.imagesMetadata.data)) {
      this.props.dispatch(loadImagesMetadata(images));
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

  renderDataGrid(data, targetData) {
    return (
      <div>
        <p>Select a column for training labels and (optionally) a column with subject IDs. Right click a corresponding columns.</p>
        <DataGrid onSelectTarget={this.handleTargetSelection.bind(this)} data={data} targetData={targetData} />
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
          <div style={{'paddingTop': 30, 'height': 30}}><Spinner opts={{position: 'relative'}}/></div>
          <div style={{'color': 'gray', 'margin': 40, 'textAlign': 'center'}}>Loading image metadata…</div>
        </div>
      </div>
    );
  }

  render() {
    const { imagesMetadata, targetData } = this.props;
    return (
      <div>
        <h1 className="page-header">Training Label</h1>
        { imagesMetadata.isFetching && this.renderLoading() }
        { !isEmpty(imagesMetadata.data) &&
          this.renderDataGrid(imagesMetadata.data, targetData) }

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
