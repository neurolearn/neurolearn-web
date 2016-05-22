import AnalysisTypes from './AnalysisTypes';

export const algorithmNameMap = {
  'svm': 'SVM',
  'logistic': 'Logistic Regression',
  'ridgeClassifier': 'Ridge Classifier',
  'ridgeClassifierCV': 'Ridge Classifier CV',
  'randomforestClassifier': 'Random Forest Classifier',

  'svr': 'SVR',
  'linear': 'Linear Regression',
  'lasso': 'Lasso',
  'lassoCV': 'Lasso CV',
  'ridge': 'Ridge',
  'ridgeCV': 'Ridge CV',
  'randomforest': 'Random Forest'
};

export const algorithmGroups = {
  [AnalysisTypes.classification]: ['svm',
                                   'logistic',
                                   'ridgeClassifier',
                                   'ridgeClassifierCV',
                                   'randomforestClassifier'],
  [AnalysisTypes.regression]: ['svr',
                               'linear',
                               'lasso',
                               'lassoCV',
                               'ridge',
                               'ridgeCV',
                               'randomforest']
};
