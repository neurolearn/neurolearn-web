/* @flow */

import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';

import selectImagesModal from '../state/selectImagesModal';
import search from '../state/search';
import auth from '../state/auth';
import selectedImages from '../state/selectedImages';
import collectionImages from '../state/collectionImages';
import imagesMetadata from '../state/imagesMetadata';
import targetData from '../state/targetData';
import subjectIdData from '../state/subjectIdData';
import modelPreferences from '../state/modelPreferences';
import testModel from '../state/testModel';
import alertMessages from '../state/alertMessages';
import fetched from '../state/fetched';

export const makeRootReducer = (asyncReducers: Object) => {
  return combineReducers({
    auth,
    imagesMetadata,
    collectionImages,
    search,
    selectedImages,
    selectImagesModal,
    targetData,
    subjectIdData,
    modelPreferences,
    testModel,
    fetched,
    alertMessages,
    router,
    ...asyncReducers
  });
};

export default makeRootReducer;
