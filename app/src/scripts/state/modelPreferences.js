import { createAction } from 'redux-actions';

import api from '../api';

import { resetSearch } from './search';
import { resetImagesMetadata } from './imagesMetadata';
import { resetSelectedImages } from './selectedImages';
import { hideSelectImagesModal } from './selectImagesModal';
import { resetTargetData } from './targetData';


export const INPUT_MODEL_NAME = 'INPUT_MODEL_NAME';
export const INPUT_KFOLD_PARAM = 'INPUT_KFOLD_PARAM';
export const INPUT_LOSO_PARAM = 'INPUT_LOSO_PARAM';
export const SELECT_CV_TYPE = 'SELECT_CV_TYPE';
export const SELECT_ALGORITHM = 'SELECT_ALGORITHM';
export const REQUEST_MODEL_TRAINING = 'REQUEST_MODEL_TRAINING';
export const RESET_MODEL_PREFERENCES = 'RESET_MODEL_PREFERENCES';


export function inputModelName(modelName) {
  return {
    type: INPUT_MODEL_NAME,
    modelName
  };
}

export function inputKfoldParam(kfoldsParam) {
  return {
    type: INPUT_KFOLD_PARAM,
    kfoldsParam
  };
}

export function inputLosoParam(losoParam) {
  return {
    type: INPUT_LOSO_PARAM,
    losoParam
  };
}

export function selectCVType(cvType) {
  return {
    type: SELECT_CV_TYPE,
    cvType
  };
}

export function selectAlgorithm(algorithm) {
  return {
    type: SELECT_ALGORITHM,
    algorithm
  };
}

const requestModelTraining = createAction(REQUEST_MODEL_TRAINING);
const resetModelPreferences = createAction(RESET_MODEL_PREFERENCES);


export function resetModelTrainData(dispatch) {
  [resetSearch,
   resetImagesMetadata,
   resetSelectedImages,
   hideSelectImagesModal,
   resetTargetData,
   resetModelPreferences].map(action => dispatch(action()));
}

export function trainModel(name, algorithm, targetData, crossValidation, router) {
  return (dispatch, getState) => {
    dispatch(requestModelTraining());

    const payload = {
      'data': targetData.data,
      'label': targetData.trainingLabel,
      'cv': crossValidation,
      algorithm,
      name
    };

    return api.post('/api/models', payload, getState().auth.token)
      .then(
        () => {
          router.push('/');
          resetModelTrainData(dispatch);
        }
    );
  };
}

const initialState = {
  isFetching: false,
  modelName: '',
  algorithm: '',
  cvType: null,
  kfoldsParam: '',
  losoParam: ''
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case INPUT_MODEL_NAME:
      return Object.assign({}, state, {
        modelName: action.modelName
      });
    case INPUT_KFOLD_PARAM:
      return Object.assign({}, state, {
        kfoldsParam: action.kfoldsParam
      });
    case INPUT_LOSO_PARAM:
      return Object.assign({}, state, {
        losoParam: action.losoParam
      });
    case SELECT_CV_TYPE:
      return Object.assign({}, state, {
        cvType: action.cvType
      });
    case SELECT_ALGORITHM:
      return Object.assign({}, state, {
        algorithm: action.algorithm
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
