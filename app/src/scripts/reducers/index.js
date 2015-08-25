import { combineReducers } from 'redux';

import authModal from '../state/authModal';
import selectImagesModal from '../state/selectImagesModal';
import search from '../state/search';
import auth from '../state/auth';
import selectedImages from '../state/selectedImages';
import imagesMetadata from '../state/imagesMetadata';
import targetData from '../state/targetData';
import mlModels from '../state/mlModels';

const rootReducer = combineReducers({
  auth,
  authModal,
  imagesMetadata,
  mlModels,
  search,
  selectedImages,
  selectImagesModal,
  targetData
});

export default rootReducer;
