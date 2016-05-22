import { isEmpty, pick } from 'lodash';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import SelectTargetColumn from '../SelectTargetColumn';
import Spinner from '../Spinner';

import AnalysisTypes from '../../constants/AnalysisTypes';
import { selectAnalysisType } from '../../state/modelPreferences';

import {
  loadImagesMetadata,
  saveImagesMetadataColumn,
  deleteImagesMetadataColumn
} from '../../state/imagesMetadata';
import { setTargetData } from '../../state/targetData';


export default class TrainingLabel extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    selectedImages: PropTypes.object,
    imagesMetadata: PropTypes.object,
    targetData: PropTypes.object,
    modelPreferences: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.handleTargetSelection = this.handleTargetSelection.bind(this);
    this.handleColumnSave = this.handleColumnSave.bind(this);
    this.handleColumnDelete = this.handleColumnDelete.bind(this);
    this.handleAnalysisTypeChange = this.handleAnalysisTypeChange.bind(this);
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

  prependRowWithColumnNames(data) {
    let firstRow = {};
    Object.keys(data[0]).map(key => firstRow[key] = key);
    return [firstRow].concat(data);
  }

  renderDataGrid(data, targetData, modelPreferences) {
    return (
      <div>
        <p className="lead">Select a column you would like to use for training labels</p>
        <div className="form-group">
          <label>Analysis type</label>
          <div className="radio">
            <label className="checkbox-inline">
              <input type="radio"
                     value="regression"
                     onChange={this.handleAnalysisTypeChange}
                     checked={modelPreferences.analysisType === AnalysisTypes.regression}/>Regression
            </label>
            <label className="checkbox-inline">
              <input type="radio"
                     value="classification"
                     onChange={this.handleAnalysisTypeChange}
                     checked={modelPreferences.analysisType === AnalysisTypes.classification}/>Classification
            </label>
          </div>
        </div>
        {/*
          When the users selects regression we allow any values,
          and show regression algos on the next step

          when the user selects classification we validate values
          so only two classes are present
          and show classification algos on the next step
        */}

        <SelectTargetColumn
          data={data}
          targetData={targetData}
          modelPreferences={modelPreferences}
          onSelectTarget={this.handleTargetSelection}
          onColumnSave={this.handleColumnSave}
          onColumnDelete={this.handleColumnDelete} />

        {/*
        <p style={{marginTop: 50}} className="lead">Select the column you would like to use for training labels by right clicking (control-click) on the column and selecting ‘Use&nbsp;as&nbsp;training&nbsp;label’.</p>
              <p>
                <ul>
                  <li>You can also optionally select a column indicating the subject labels to ensure they are held out together when using cross-validation.</li>
                  <li>You can use formulas and functions in the cells.</li>
                </ul>
              </p>

              <DataGrid onSelectTarget={this.handleTargetSelection} data={data} targetData={targetData} />
        */}
      </div>
    );
  }

  // shouldComponentUpdate(nextProps) {
  //   return nextProps.imagesMetadata !== this.props.imagesMetadata;
  // }

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
    const { imagesMetadata, targetData, modelPreferences } = this.props;
    return (
      <div>
        <h1 className="page-header">Training Label</h1>
        { imagesMetadata.isFetching && this.renderLoading() }
        { !isEmpty(imagesMetadata.data) &&
          this.renderDataGrid(imagesMetadata.data, targetData, modelPreferences) }

        <hr/>
        <Link disabled={false}
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
