import { createAction } from 'redux-actions';

import AnalysisTypes from '../constants/AnalysisTypes';

import api from '../api';
import { apiError } from './alertMessages';

import { resetSearch } from './search';
import { resetImagesMetadata } from './imagesMetadata';
import { resetSelectedImages } from './selectedImages';
import { hideSelectImagesModal } from './selectImagesModal';
import { resetTargetData } from './targetData';
import { resetSubjectIdData } from './subjectIdData';

export const INPUT_MODEL_NAME = 'INPUT_MODEL_NAME';
export const INPUT_DESCRIPTION = 'INPUT_DESCRIPTION';
export const INPUT_KFOLD_PARAM = 'INPUT_KFOLD_PARAM';
export const SELECT_CV_TYPE = 'SELECT_CV_TYPE';
export const SELECT_ACCESS_LEVEL = 'SELECT_ACCESS_LEVEL';
export const SELECT_ANALYSIS_TYPE = 'SELECT_ANALYSIS_TYPE';
export const SELECT_ALGORITHM = 'SELECT_ALGORITHM';
export const REQUEST_MODEL_TRAINING = 'REQUEST_MODEL_TRAINING';
export const RESET_MODEL_PREFERENCES = 'RESET_MODEL_PREFERENCES';
export const SET_KFOLD_USE_SUBJECT_IDS = 'SET_KFOLD_USE_SUBJECT_IDS';

export const inputModelName = createAction(INPUT_MODEL_NAME);
export const inputDescription  = createAction(INPUT_DESCRIPTION);
export const inputKfoldParam = createAction(INPUT_KFOLD_PARAM);
export const selectCVType = createAction(SELECT_CV_TYPE);
export const selectAccessLevel = createAction(SELECT_ACCESS_LEVEL);
export const selectAnalysisType = createAction(SELECT_ANALYSIS_TYPE);
export const selectAlgorithm = createAction(SELECT_ALGORITHM);
export const setKfoldUseSubjectIds = createAction(SET_KFOLD_USE_SUBJECT_IDS);

const requestModelTraining = createAction(REQUEST_MODEL_TRAINING);
const resetModelPreferences = createAction(RESET_MODEL_PREFERENCES);

export function resetModelTrainData(dispatch) {
  [resetSearch,
   resetImagesMetadata,
   resetSelectedImages,
   hideSelectImagesModal,
   resetTargetData,
   resetSubjectIdData,
   resetModelPreferences].map(action => dispatch(action()));
}

export function trainModel(name,
                           description,
                           algorithm,
                           targetData,
                           collections,
                           crossValidation,
                           router) {
  return dispatch => {
    dispatch(requestModelTraining());

    const payload = {
      'data': targetData.data,
      'label': targetData.field,
      'cv': crossValidation,
      collections,
      algorithm,
      description,
      name
    };

    return api.post('/api/models', payload)
      .then(
        () => {
          router.push('/dashboard/models');
          resetModelTrainData(dispatch);
        }
    );
  };
}

export function retrainModelWith(modelId, params, success) {
  return dispatch => {
    dispatch(requestModelTraining());

    return api.post(`/api/models/${modelId}/retrain`, params)
      .then(success, error => dispatch(apiError(error)));
  }
}

const initialState = {
  isFetching: false,
  modelName: '',
  description: '',
  algorithm: '',
  cvType: '',
  kfoldsParam: '',
  losoParam: '',
  public: true,
  kfoldUseSubjectIDs: false,
  analysisType: AnalysisTypes.regression
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case INPUT_MODEL_NAME:
      return Object.assign({}, state, {
        modelName: action.payload
      });
    case INPUT_DESCRIPTION:
      return Object.assign({}, state, {
        description: action.payload
      });
    case INPUT_KFOLD_PARAM:
      return Object.assign({}, state, {
        kfoldsParam: action.payload
      });
    case SELECT_ANALYSIS_TYPE:
      return Object.assign({}, state, {
        analysisType: action.payload
      });
    case SELECT_ACCESS_LEVEL:
      return Object.assign({}, state, {
        public: action.payload
      });
    case SELECT_CV_TYPE:
      return Object.assign({}, state, {
        cvType: action.payload
      });
    case SELECT_ALGORITHM:
      return Object.assign({}, state, {
        algorithm: action.payload
      });
    case SET_KFOLD_USE_SUBJECT_IDS:
      return Object.assign({}, state, {
        kfoldUseSubjectIDs: action.payload
      });
    case REQUEST_MODEL_TRAINING:
      return Object.assign({}, state, {
        isFetching: true
      });
    case RESET_MODEL_PREFERENCES:
      return initialState;
    default:
      return state;
  }
}
