import { isEmpty, some, mapValues, pick } from 'lodash';
import React, { PropTypes } from 'react';
import classNames from 'classnames';

import { connect } from 'react-redux';
import {
  inputModelName,
  inputDescription,
  inputKfoldParam,
  selectCVType,
  selectAlgorithm,
  trainModel,
} from '../../state/modelPreferences';


export default class ModelPreferences extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    targetData: PropTypes.object.isRequired,
    modelPreferences: PropTypes.object.isRequired,
    collectionsById: PropTypes.object.isRequired
  }

  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  handleSubmit(e) {
    e.preventDefault();

    const { router } = this.context;
    const { modelName, description, algorithm, cvType } = this.props.modelPreferences;
    const { collectionsById, targetData } = this.props;
    const cv = {type: cvType, 'value': this.props.modelPreferences[cvType + 'Param']};
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

    return !some([modelName, algorithm], isEmpty)
           && (cvType === 'kfolds' && !isEmpty(kfoldsParam)
               || cvType === 'loso');
  }

  genHandler(refName, action) {
    const _this = this;
    return () => {
      const value = _this.refs[refName].value;
      _this.props.dispatch(action(value));
    };
  }

  handleRadioChange(e) {
    const cvType = e.target.value;
    this.props.dispatch(selectCVType(cvType));
  }

  handleAlgorithmChange() {
    const algorithm = this.refs.algorithm.value;
    this.props.dispatch(selectAlgorithm(algorithm));
  }

  render() {
    const { modelPreferences } = this.props;

    var classes = classNames({
      'btn': true,
      'btn-primary': true,
      'disabled': !this.submitEnabled()
    });

    return (
      <div>
        <h1 className="page-header">Model Preferences</h1>
        <div className="row">
          <div className="col-md-6">
            <form onSubmit={this.handleSubmit.bind(this)}>
              <div className="form-group">
                <label>Model Name</label>
                <input type='text'
                       value={modelPreferences.modelName}
                       onChange={this.genHandler('modelName', inputModelName)}
                       ref='modelName'
                       label=''
                       className="form-control" />
              </div>
              <div className="form-group">
                <label>Description <span style={{color: 'gray'}}>(optional)</span></label>
                <textarea type='textarea'
                       value={modelPreferences.description}
                       onChange={this.genHandler('description', inputDescription)}
                       ref='description'
                       label=''
                       className="form-control" />
              </div>
              <div className="form-group">
                <label>Algorithm Type</label>
                <select className="form-control"
                        value={modelPreferences.algorithm}
                        ref="algorithm"
                        onChange={this.handleAlgorithmChange.bind(this)}
                        style={{marginRight: 10}}>
                  <option value="">Select an Algorithm</option>
                  <optgroup label="Classify">
                    <option value="svm">SVM</option>
                    <option value="logistic">Logistic Regression</option>
                    <option value="ridgeClassifier">Ridge Classifier</option>
                    <option value="ridgeClassifierCV">Ridge Classifier CV</option>
                  </optgroup>
                  <optgroup label="Predict">
                    <option value="svr">SVR</option>
                    <option value="linear">Linear Regression</option>
                    <option value="lasso">Lasso</option>
                    <option value="lassoCV">Lasso CV</option>
                    <option value="ridge">Ridge</option>
                    <option value="ridgeCV">Ridge CV</option>
                  </optgroup>
                </select>
              </div>
              <div className="form-group">
                <label>Cross Validation</label>
                <div className="radio">
                  <label>
                    <input type="radio"
                           ref="cvType"
                           onChange={this.handleRadioChange.bind(this)}
                           name="cvType"
                           value="kfolds"
                           checked={modelPreferences.cvType === 'kfolds'} />
                    k-fold
                  </label>
                </div>

                <div className="form-horizontal well">
                  <fieldset disabled={modelPreferences.cvType !== 'kfolds'}>
                    <div className="form-group">
                      <label className="col-sm-5 control-label">Number of Divisions (k)</label>
                      <div className="col-sm-7">
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
                           onChange={this.handleRadioChange.bind(this)}
                           name="cvType"
                           value="loso"
                           checked={modelPreferences.cvType === 'loso'} />
                    Leave One Subject Out
                  </label>
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
        </div>
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
    modelPreferences: state.modelPreferences,
    collectionsById: elasticEntitiesToObjects(
      state.selectedImages.collectionsById)
  }
}

export default connect(select)(ModelPreferences);
