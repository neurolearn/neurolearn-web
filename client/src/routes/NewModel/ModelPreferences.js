/* @flow */

import { isEmpty, mapValues, pick, zipWith } from 'lodash';
import React, { PropTypes } from 'react';
import classNames from 'classnames';

import SelectTargetColumn from 'components/SelectTargetColumn';

import {
  algorithmGroups,
  algorithmNameMap
} from 'constants/Algorithms';

import CVTypes from 'constants/CrossValidationTypes';

import { connect } from 'react-redux';
import {
  inputModelName,
  inputDescription,
  inputMaskId,
  inputKfoldParam,
  setPrivate,
  selectCVType,
  selectAlgorithm,
  setKfoldUseSubjectIds,
  trainModel
} from 'state/modelPreferences';

import {
  saveImagesMetadataColumn,
  deleteImagesMetadataColumn
} from 'state/imagesMetadata';

import {
  setSubjectIdData
} from 'state/subjectIdData';

function validate(cv, subjectIdData, modelPreferences) {
  const errors = {};
  const { modelName, algorithm, kfoldsParam } = modelPreferences;

  if (!modelName || !modelName.trim()) {
    errors.modelName = 'Required field.';
  }

  if (!algorithm) {
    errors.algorithm = 'Required field.';
  }

  if (cv.type === CVTypes.kfolds && isEmpty(kfoldsParam)) {
    errors.kfoldsParam = 'Required field.';
  }

  if (cv.type === CVTypes.loso && subjectIdData.field.index === null) {
    errors.loso = 'Subject ID is required for this type of cross validation.';
  }

  if (cv.type === CVTypes.kfolds &&
      modelPreferences.kfoldUseSubjectIDs &&
      subjectIdData.field.index === null) {
    errors.kfoldSubjectId = 'Subject ID is required.';
  }

  return errors;
}

class ModelPreferences extends React.Component {
  state: {
    errors: Object
  };

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

  constructor(props: Object) {
    super(props);

    this.state = {
      errors: {}
    };

    (this:any).handleAlgorithmChange = this.handleAlgorithmChange.bind(this);
    (this:any).handleCVTypeChange = this.handleCVTypeChange.bind(this);
    (this:any).handleAccessLevelChange = this.handleAccessLevelChange.bind(this);
    (this:any).handleSubmit = this.handleSubmit.bind(this);
    (this:any).handleColumnSave = this.handleColumnSave.bind(this);
    (this:any).handleColumnDelete = this.handleColumnDelete.bind(this);
    (this:any).handleSubjectIdSelection = this.handleSubjectIdSelection.bind(this);
    (this:any).handleKfoldUseSubjectIdsClick = this.handleKfoldUseSubjectIdsClick.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();

    const { router } = this.context;
    const {
      modelPreferences: prefs,
      modelPreferences: { cvType }
    } = this.props;

    const { collectionsById, targetData, subjectIdData } = this.props;
    const cv = cvType && {type: cvType, 'value': this.props.modelPreferences[cvType + 'Param']};
    const mask = prefs.maskId && { id: prefs.maskId };

    const errors = validate(cv, subjectIdData, this.props.modelPreferences);

    if (!isEmpty(errors)) {
      this.setState({errors});
      return;
    }

    const targetWithSubjectId = {
      field: targetData.field,
      data: zipWith(targetData.data, subjectIdData.data,
        (accumulator, value) => Object.assign({}, accumulator, {subject_id: value.target}))
    };
    this.props.dispatch(trainModel(prefs.modelName,
                                   prefs.description,
                                   prefs.private,
                                   prefs.algorithm,
                                   targetWithSubjectId,
                                   collectionsById,
                                   cv,
                                   mask,
                                   router));
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

  handleAccessLevelChange(e) {
    this.props.dispatch(setPrivate(e.target.value === 'private'));
  }

  handleAlgorithmChange(e) {
    this.props.dispatch(selectAlgorithm(e.target.value));
  }

  handleSubjectIdSelection(fieldData) {
    this.props.dispatch(setSubjectIdData(fieldData));
  }

  handleKfoldUseSubjectIdsClick(e) {
    this.props.dispatch(setKfoldUseSubjectIds(e.target.checked));
  }

  handleColumnSave(name: string, values) {
    this.props.dispatch(saveImagesMetadataColumn({name, values}));
  }

  handleColumnDelete(name: string) {
    this.props.dispatch(deleteImagesMetadataColumn(name));
  }

  renderSelectTargetColumn(imagesData, subjectIdData) {
    return (
      <SelectTargetColumn
        data={imagesData}
        targetData={subjectIdData}
        onSelectTarget={this.handleSubjectIdSelection}
        onColumnSave={this.handleColumnSave}
        onColumnDelete={this.handleColumnDelete}
      />
    );
  }

  renderError(error) {
    return error && <div className="help-block">{error}</div>;
  }

  render() {
    const { modelPreferences, subjectIdData, imagesData } = this.props;
    const { errors } = this.state;

    return (
      <div>
        <h1 className="page-header">Model Preferences</h1>
        <form onSubmit={this.handleSubmit}>
          <div className="row">
            <div className={classNames('form-group',
                                       'col-md-6',
                                       errors.modelName && 'has-error')}>
              <label className="control-label">Model Name</label>
              <input type="text"
                value={modelPreferences.modelName}
                onChange={this.genHandler('modelName', inputModelName)}
                ref="modelName"
                label=""
                className="form-control"
              />
              {this.renderError(errors.modelName)}
            </div>
          </div>
          <div className="row">
            <div className="form-group col-md-6">
              <label>Description <span style={{color: 'gray'}}>(optional)</span></label>
              <textarea
                type="textarea"
                value={modelPreferences.description}
                onChange={this.genHandler('description', inputDescription)}
                ref="description"
                label=""
                className="form-control"
              />
            </div>
          </div>

          <div className="row">
            <div className={classNames('form-group',
                                       'col-md-6',
                                       errors.maskId && 'has-error')}>
              <label className="control-label">Mask <span style={{color: 'gray'}}>(optional)</span></label>
              <input type="text"
                value={modelPreferences.maskId}
                onChange={this.genHandler('maskId', inputMaskId)}
                ref="maskId"
                label=""
                placeholder="NeuroVault Image Id"
                className="form-control"
              />
              {this.renderError(errors.maskId)}
            </div>
          </div>

          <div className="form-group">
            <label>Access level</label>
            <div className="radio">
              <label>
                <input
                  type="radio"
                  onChange={this.handleAccessLevelChange}
                  value="public"
                  checked={!modelPreferences.private}
                />
                Public (anyone can see this model)
              </label>
            </div>
            <div className="radio">
              <label>
                <input
                  type="radio"
                  onChange={this.handleAccessLevelChange}
                  value="private"
                  checked={modelPreferences.private}
                />
                Private
              </label>
            </div>
          </div>

          <div className={classNames('form-group',
                                     errors.algorithm && 'has-error')}>
            <label className="control-label">Algorithm</label>
            {algorithmGroups[modelPreferences.analysisType].map(type =>
              <div className="radio" key={type}>
                <label>
                  <input
                    type="radio"
                    onChange={this.handleAlgorithmChange}
                    value={type}
                    checked={type === modelPreferences.algorithm}
                  />
                  {algorithmNameMap[type]}
                </label>
              </div>
            )}
            {this.renderError(errors.algorithm)}
          </div>
          <div className="form-group">
            <label>Cross Validation</label>
            <div className="radio">
              <label>
                <input
                  type="radio"
                  ref="cvType"
                  onChange={this.handleCVTypeChange}
                  name="cvType"
                  value=""
                  checked={modelPreferences.cvType === ''}
                />
                None
              </label>
            </div>

            <div className="radio">
              <label>
                <input
                  type="radio"
                  ref="cvType"
                  onChange={this.handleCVTypeChange}
                  name="cvType"
                  value={CVTypes.kfolds}
                  checked={modelPreferences.cvType === CVTypes.kfolds}
                />
                k-fold
              </label>
            </div>

            <div className={classNames('well',
                                       (modelPreferences.cvType !== CVTypes.kfolds) && 'hide')}>
              <fieldset>
                <div className="row">
                  <div className={classNames('form-group',
                                             'col-md-6',
                                             errors.kfoldsParam && 'has-error')}>

                    <label className="control-label">Number of Divisions (k)</label>
                    <div>
                      <input
                        type="text"
                        ref="kfoldsParam"
                        onChange={this.genHandler('kfoldsParam', inputKfoldParam)}
                        value={modelPreferences.kfoldsParam}
                        className="form-control"
                      />
                    </div>
                    {this.renderError(errors.kfoldsParam)}
                  </div>
                </div>
                <div className="checkbox">
                  <label>
                    <input
                      type="checkbox"
                      checked={modelPreferences.kfoldUseSubjectIDs}
                      onChange={this.handleKfoldUseSubjectIdsClick}
                    /> Use Subject IDs
                  </label>
                </div>
                <div className={classNames('form-group',
                                           !modelPreferences.kfoldUseSubjectIDs && 'hide',
                                           errors.kfoldSubjectId && 'has-error')}>
                  <label className="control-label">Select the row with Subject IDs</label>
                  {this.renderSelectTargetColumn(imagesData, subjectIdData)}
                  {this.renderError(errors.kfoldSubjectId)}
                </div>
              </fieldset>
            </div>
            <div className="radio">
              <label>
                <input
                  type="radio"
                  ref="cvType"
                  onChange={this.handleCVTypeChange}
                  name="cvType"
                  value={CVTypes.loso}
                  checked={modelPreferences.cvType === CVTypes.loso}
                />
                Leave One Subject Out
              </label>
            </div>
            <div className={classNames('well', (modelPreferences.cvType !== CVTypes.loso) && 'hide')}>
              <fieldset>
                <div className={classNames('form-group', errors.loso && 'has-error')}>
                  <label className="control-label">Select the row with Subject IDs</label>
                  {this.renderSelectTargetColumn(imagesData, subjectIdData)}
                  {this.renderError(errors.loso)}
                </div>
              </fieldset>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={modelPreferences.isFetching}
          >{modelPreferences.isFetching ? 'Please wait…' : 'Train Model'}</button>
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
  };
}

export default connect(select)(ModelPreferences);
