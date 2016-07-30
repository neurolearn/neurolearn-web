/* @flow */

import { isEmpty, pick, pluck } from 'lodash';
import classNames from 'classnames';

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import SelectTargetColumn from '../SelectTargetColumn';
import Spinner from '../Spinner';

import AnalysisTypes from '../../constants/AnalysisTypes';
import { selectAnalysisType } from '../../state/modelPreferences';

import { isBinaryCollection } from '../../utils';

import {
  loadImagesMetadata,
  saveImagesMetadataColumn,
  deleteImagesMetadataColumn
} from '../../state/imagesMetadata';

import { setTargetData } from '../../state/targetData';

function validate(targetData: Object, analysisType: string): string {
  if (targetData.field.index === null) {
    return 'A data field selection is required.';
  }

  if (analysisType === AnalysisTypes.classification &&
      !isBinaryCollection(pluck(targetData.data, 'target'))) {
    return `“${targetData.field.name}” field contains more than two classes. ` +
           'Classification requires binary data. You might consider editing this field, ' +
           'selecting a different categorical field, or adding a new field.';
  }

  return '';
}

class TrainingLabel extends React.Component {
  state: {
    errors: string
  }

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    selectedImages: PropTypes.object,
    imagesMetadata: PropTypes.object,
    targetData: PropTypes.object,
    modelPreferences: PropTypes.object
  };

  constructor(props: Object) {
    super(props);

    this.state = {
      errors: ''
    };

    (this:any).handleTargetSelection = this.handleTargetSelection.bind(this);
    (this:any).handleColumnSave = this.handleColumnSave.bind(this);
    (this:any).handleColumnDelete = this.handleColumnDelete.bind(this);
    (this:any).handleAnalysisTypeChange = this.handleAnalysisTypeChange.bind(this);
    (this:any).handleContinueClick = this.handleContinueClick.bind(this);
  }

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

  handleAnalysisTypeChange(e) {
    this.props.dispatch(selectAnalysisType(e.target.value));
  }

  handleTargetSelection(targetData) {
    this.props.dispatch(setTargetData(targetData));
  }

  handleColumnSave(name, values) {
    this.props.dispatch(saveImagesMetadataColumn({name, values}));
  }

  handleColumnDelete(name) {
    this.props.dispatch(deleteImagesMetadataColumn(name));
  }

  handleContinueClick(e) {
    const { targetData, modelPreferences } = this.props;

    const errors = validate(targetData, modelPreferences.analysisType);
    if (errors) {
      e.preventDefault();
      this.setState({ errors: errors });
    }
  }

  renderDataGrid(data, targetData, modelPreferences) {
    const { errors } = this.state;

    return (
      <div>
        <div className="form-group">
          <label>Analysis type</label>
          <div className="radio">
            <label className="checkbox-inline">
              <input
                type="radio"
                value="regression"
                onChange={this.handleAnalysisTypeChange}
                checked={modelPreferences.analysisType === AnalysisTypes.regression}
              />Regression
            </label>
            <label className="checkbox-inline">
              <input
                type="radio"
                value="classification"
                onChange={this.handleAnalysisTypeChange}
                checked={modelPreferences.analysisType === AnalysisTypes.classification}
              />Classification
            </label>
          </div>
        </div>
        <div className={classNames('form-group', errors && 'has-error')}>
          <label className="control-label">Select the row with the variable you would like to use for training labels</label>
          <SelectTargetColumn
            data={data}
            targetData={targetData}
            onSelectTarget={this.handleTargetSelection}
            onColumnSave={this.handleColumnSave}
            onColumnDelete={this.handleColumnDelete} />
          {errors && <div className="help-block">{errors}</div>}
        </div>
      </div>
    );
  }

  renderLoading() {
    return (
      <div className="row">
        <div className="col-md-12" >
          <div style={{'paddingTop': 30, 'height': 30}}><Spinner opts={{position: 'relative'}} /></div>
          <div style={{'color': 'gray', 'margin': 40, 'textAlign': 'center'}}>Loading image metadata…</div>
        </div>
      </div>
    );
  }

  render() {
    const { imagesMetadata, targetData, modelPreferences } = this.props;
    return (
      <div>
        <h1 className="page-header">Training Label</h1>
        {imagesMetadata.isFetching && this.renderLoading()}
        {!isEmpty(imagesMetadata.data) &&
          this.renderDataGrid(imagesMetadata.data, targetData, modelPreferences)}

        <hr />
        <Link
          onClick={this.handleContinueClick}
          className="btn btn-primary continue-button"
          to="/models/new/model-preferences">Continue to Model Preferences</Link>
      </div>
    );
  }
}

function select(state) {
  return state;
}

export default connect(select)(TrainingLabel);
