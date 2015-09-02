import request from 'superagent';

export const INPUT_MODEL_NAME = 'INPUT_MODEL_NAME';
export const INPUT_KFOLD_PARAM = 'INPUT_KFOLD_PARAM';
export const INPUT_LOSO_PARAM = 'INPUT_LOSO_PARAM';
export const SELECT_CV_TYPE = 'SELECT_CV_TYPE';
export const SELECT_ALGORITHM = 'SELECT_ALGORITHM';
export const REQUEST_MODEL_TRAINING = 'REQUEST_MODEL_TRAINING';


export function inputModelName(modelName) {
  return {
    type: INPUT_MODEL_NAME,
    modelName
  };
}

export function inputKfoldParam(kfoldParam) {
  return {
    type: INPUT_KFOLD_PARAM,
    kfoldParam
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

function requestModelTraining() {
  return {
    type: REQUEST_MODEL_TRAINING
  };
}

function startModelTraining(name, algorithm, targetData, cv, token) {
  const payload = {
    'data': targetData,
    'collection_id': 504,
    algorithm,
    name,
    cv
  };

  return request.post('/mlmodels')
    .type('json')
    .accept('json')
    .set('Authorization', 'Bearer ' + token)
    .send(payload);
}

export function trainModel(name, algorithm, targetData, crossValidation, router) {
  return (dispatch, getState) => {
    dispatch(requestModelTraining());

    return startModelTraining(name, algorithm, targetData, crossValidation,
                              getState().auth.token)
      .end((err, res) => {
        router.transitionTo('/');
      });
  };
}


export default function reducer(state = {
  modelName: '',
  algorithm: '',
  cvType: null,
  kfoldParam: '',
  losoParam: ''
}, action) {
  switch (action.type) {
    case INPUT_MODEL_NAME:
      return Object.assign({}, state, {
        modelName: action.modelName
      });
    case INPUT_KFOLD_PARAM:
      return Object.assign({}, state, {
        kfoldParam: action.kfoldParam
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
    default:
      return state;
  }
}
