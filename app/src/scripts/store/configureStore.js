import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import rootReducer from '../reducers';

import {autoRehydrate} from 'redux-persist';

const logger = createLogger({});

const _createStoreWithMiddleware = applyMiddleware(
  thunkMiddleware,
  logger
)(createStore);

const createStoreWithMiddleware = (autoRehydrate())(_createStoreWithMiddleware);

export default function configureStore(initialState) {
  return createStoreWithMiddleware(rootReducer, initialState);
}
