import { combineReducers } from 'redux';

import selectImagesModal from '../state/selectImagesModal';
import search from '../state/search';
import auth from '../state/auth';
import selectedImages from '../state/selectedImages';
import imagesMetadata from '../state/imagesMetadata';
import targetData from '../state/targetData';
import modelPreferences from '../state/modelPreferences';
import testModel from '../state/testModel';
import modelTests from '../state/modelTests';
import alertMessages from '../state/alertMessages';
import itemList from '../state/itemList';
import itemDetail from '../state/itemDetail';

const rootReducer = combineReducers({
  auth,
  imagesMetadata,
  search,
  selectedImages,
  selectImagesModal,
  targetData,
  modelPreferences,
  testModel,
  modelTests,
  itemList,
  itemDetail,
  alertMessages
});

export default rootReducer;
