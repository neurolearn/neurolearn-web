export const INPUT_MODEL_NAME = 'INPUT_MODEL_NAME';
export const INPUT_KFOLD_PARAM = 'INPUT_KFOLD_PARAM';
export const INPUT_LOSO_PARAM = 'INPUT_LOSO_PARAM';
export const SELECT_CV_TYPE = 'SELECT_CV_TYPE';
export const SELECT_ALGORITHM = 'SELECT_ALGORITHM';


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
