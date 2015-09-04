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
  'classify': ['svm', 'logistic', 'ridgeClassifier', 'ridgeClassifierCV',
               'randomforestClassifier'],
  'predict': ['svr', 'linear', 'lasso', 'lassoCV', 'ridge', 'ridgeCV',
              'randomforest']
};
