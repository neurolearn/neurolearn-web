import { combineReducers } from 'redux';

import selectImagesModal from '../state/selectImagesModal';
import search from '../state/search';
import auth from '../state/auth';
import selectedImages from '../state/selectedImages';
import imagesMetadata from '../state/imagesMetadata';
import targetData from '../state/targetData';
import mlModels from '../state/mlModels';
import publicMLModels from '../state/publicMLModels';
import publicModelTests from '../state/publicModelTests';
import modelPreferences from '../state/modelPreferences';
import testModel from '../state/testModel';
import modelTests from '../state/modelTests';
import entities from '../state/entities';

const rootReducer = combineReducers({
  auth,
  imagesMetadata,
  mlModels,
  publicMLModels,
  publicModelTests,
  search,
  selectedImages,
  selectImagesModal,
  targetData,
  modelPreferences,
  testModel,
  modelTests,
  entities
});

export default rootReducer;
