import { isEmpty, some, mapValues, pick } from 'lodash';
import React, { PropTypes } from 'react';
import classNames from 'classnames';

import SelectTargetColumn from '../SelectTargetColumn';

import {
  algorithmGroups,
  algorithmNameMap
} from '../../constants/Algorithms';

import { connect } from 'react-redux';
import {
  inputModelName,
  inputDescription,
  inputKfoldParam,
  selectCVType,
  selectAlgorithm,
  trainModel,
} from '../../state/modelPreferences';

import {
  saveImagesMetadataColumn,
  deleteImagesMetadataColumn
} from '../../state/imagesMetadata';

import {
  setSubjectIdData
} from '../../state/subjectIdData';


export default class ModelPreferences extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    targetData: PropTypes.object.isRequired,
    subjectIdData: PropTypes.object.isRequired,
    modelPreferences: PropTypes.object.isRequired,
    collectionsById: PropTypes.object.isRequired,
    imagesData: PropTypes.array.isRequired
  };

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.handleAlgorithmChange = this.handleAlgorithmChange.bind(this);
    this.handleCVTypeChange = this.handleCVTypeChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleColumnSave = this.handleColumnSave.bind(this);
    this.handleColumnDelete = this.handleColumnDelete.bind(this);
    this.handleSubjectIdSelection = this.handleSubjectIdSelection.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();

    const { router } = this.context;
    const { modelName, description, algorithm, cvType } = this.props.modelPreferences;
    const { collectionsById, targetData } = this.props;
    const cv = cvType && {type: cvType, 'value': this.props.modelPreferences[cvType + 'Param']};

    this.props.dispatch(trainModel(modelName,
                                   description,
                                   algorithm,
                                   targetData,
                                   collectionsById,
                                   cv,
                                   router));
  }

  submitEnabled() {
    const {
      modelName,
      algorithm,
      cvType,
      kfoldsParam
    } = this.props.modelPreferences;

    const cvTypeInvalid = (cvType === 'kfolds' && isEmpty(kfoldsParam));
    return !(some([modelName, algorithm], isEmpty) || cvTypeInvalid);
  }

  genHandler(refName, action) {
    const _this = this;
    return () => {
      const value = _this.refs[refName].value;
      _this.props.dispatch(action(value));
    };
  }

  handleCVTypeChange(e) {
    this.props.dispatch(selectCVType(e.target.value));
  }

  handleAlgorithmChange(e) {
    this.props.dispatch(selectAlgorithm(e.target.value));
  }

  handleSubjectIdSelection(fieldData) {
    this.props.dispatch(setSubjectIdData(fieldData));
  }

  handleColumnSave(name, values) {
    this.props.dispatch(saveImagesMetadataColumn({name, values}));
  }

  handleColumnDelete(name) {
    this.props.dispatch(deleteImagesMetadataColumn(name));
  }

  render() {
    const {
      modelPreferences, targetData,
      subjectIdData, imagesData
    } = this.props;

    const classes = classNames({
      'btn': true,
      'btn-primary': true,
      'disabled': !this.submitEnabled()
    });

    return (
      <div>
        <h1 className="page-header">Model Preferences</h1>
        <form onSubmit={this.handleSubmit}>
          <div className="row">
            <div className="form-group col-md-6">
              <label>Model Name</label>
              <input type='text'
                     value={modelPreferences.modelName}
                     onChange={this.genHandler('modelName', inputModelName)}
                     ref='modelName'
                     label=''
                     className="form-control" />
            </div>
          </div>
          <div className="row">
            <div className="form-group col-md-6">
              <label>Description <span style={{color: 'gray'}}>(optional)</span></label>
              <textarea type='textarea'
                     value={modelPreferences.description}
                     onChange={this.genHandler('description', inputDescription)}
                     ref='description'
                    label=''
                    className="form-control" />
              </div>
          </div>
          <div className="form-group">
            <label>Algorithm</label>
            {algorithmGroups[modelPreferences.analysisType].map(type =>
              <div className="radio" key={type}>
                <label>
                  <input type="radio"
                         onChange={this.handleAlgorithmChange}
                         value={type}
                         checked={type === modelPreferences.algorithm} />
                  {algorithmNameMap[type]}
                </label>
              </div>
            )}
          </div>
          <div className="form-group">
            <label>Cross Validation</label>
            <div className="radio">
              <label>
                <input type="radio"
                       ref="cvType"
                       onChange={this.handleCVTypeChange}
                       name="cvType"
                       value=""
                       checked={modelPreferences.cvType === ''} />
                None
              </label>
            </div>

            <div className="radio">
              <label>
                <input type="radio"
                       ref="cvType"
                       onChange={this.handleCVTypeChange}
                       name="cvType"
                       value="kfolds"
                       checked={modelPreferences.cvType === 'kfolds'} />
                k-fold
              </label>
            </div>

            <div className={classNames('form-horizontal', 'well', (modelPreferences.cvType !== 'kfolds') && 'hide')}>
              <fieldset disabled={modelPreferences.cvType !== 'kfolds'}>
                <div className="form-group">
                  <label className="col-sm-2 control-label">Number of Divisions (k)</label>
                  <div className="col-sm-4">
                    <input type="text"
                           ref="kfoldsParam"
                           onChange={this.genHandler('kfoldsParam', inputKfoldParam)}
                           value={modelPreferences.kfoldsParam}
                           className="form-control" />
                  </div>
                </div>
              </fieldset>
            </div>
            <div className="radio">
              <label>
                <input type="radio"
                       ref="cvType"
                       onChange={this.handleCVTypeChange}
                       name="cvType"
                       value="loso"
                       checked={modelPreferences.cvType === 'loso'} />
                Leave One Subject Out
              </label>
            </div>
            <div className={classNames('well', (modelPreferences.cvType !== 'loso') && 'hide')}>
              <fieldset disabled={modelPreferences.cvType !== 'loso'}>
                <div className="form-group">
                  <label className="control-label">Select a field with Subject IDs</label>
                  <SelectTargetColumn
                    data={imagesData}
                    targetData={subjectIdData}
                    onSelectTarget={this.handleSubjectIdSelection}
                    onColumnSave={this.handleColumnSave}
                    onColumnDelete={this.handleColumnDelete} />
                </div>
              </fieldset>
            </div>
          </div>

          <button type="submit"
                  className={classes}
                  disabled={modelPreferences.isFetching}>{
                    modelPreferences.isFetching
                    ? 'Please wait…'
                    : 'Train Model'}</button>
        </form>
      </div>
    );
  }
}

function elasticEntitiesToObjects(collectionsById) {
  return mapValues(collectionsById, obj => pick(obj._source, ['name']));
}

function select(state) {
  return {
    targetData: state.targetData,
    subjectIdData: state.subjectIdData,
    modelPreferences: state.modelPreferences,
    collectionsById: elasticEntitiesToObjects(
      state.selectedImages.collectionsById),
    imagesData: state.imagesMetadata.data
  }
}

export default connect(select)(ModelPreferences);
