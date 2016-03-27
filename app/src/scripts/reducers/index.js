import { combineReducers } from 'redux';

import selectImagesModal from '../state/selectImagesModal';
import search from '../state/search';
import auth from '../state/auth';
import selectedImages from '../state/selectedImages';
import imagesMetadata from '../state/imagesMetadata';
import targetData from '../state/targetData';
import modelPreferences from '../state/modelPreferences';
import testModel from '../state/testModel';
import alertMessages from '../state/alertMessages';
import fetched from '../state/fetched';

const rootReducer = combineReducers({
  auth,
  imagesMetadata,
  search,
  selectedImages,
  selectImagesModal,
  targetData,
  modelPreferences,
  testModel,
  fetched,
  alertMessages
});

export default rootReducer;
