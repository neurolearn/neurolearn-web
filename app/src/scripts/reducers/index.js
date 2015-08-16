import { combineReducers } from 'redux';

import {
  SHOW_SELECT_IMAGES_MODAL,
  HIDE_SELECT_IMAGES_MODAL,
  TOGGLE_IMAGE,
  TOGGLE_ALL_IMAGES,
  REQUEST_SEARCH_RESULTS,
  RECEIVE_SEARCH_RESULTS,
  INPUT_SEARCH_QUERY,
  CHANGE_FILTER,
  SELECT_SEARCH_OFFSET,
  SELECT_SORT_TYPE
} from '../actions/actionTypes';
import { DEFAULT_SEARCH_SORT } from '../constants/Search';

import update from 'react/lib/update';

function imageToggle(state, collectionId, imageId) {
  const toggle = function(x) {
    if (x) {
      if (x[imageId]) {
        x[imageId] = false;
      } else {
        x[imageId] = true;
      }
      return x;
    } else {
      return {[imageId]: true};
    }
  };

  return update(state,
    {[collectionId]: {$apply: toggle}}
  );
}

function toggleAllImages(state, collectionId, imageList, checked) {
  const images = imageList.reduce(function(accum, image) {
    accum[image] = checked;
    return accum;
  }, {});

  return update(state,
    {[collectionId]: {$set: images}}
  );
}

function selectImagesModal(state = { display: false, collectionId: null },
                           action) {
  switch (action.type) {
    case SHOW_SELECT_IMAGES_MODAL:
      return { display: true, collectionId: action.collectionId };

    case HIDE_SELECT_IMAGES_MODAL:
      return { display: false, collectionId: null };

    default:
      return state;
  }
}

function selectedImages(state = {}, action) {
  switch (action.type) {
    case TOGGLE_IMAGE:
      return imageToggle(state, action.collectionId, action.imageId);

    case TOGGLE_ALL_IMAGES:
      return toggleAllImages(state, action.collectionId, action.imageList,
                             action.checked);

    default:
      return state;
  }
}

function search(state = {
    isFetching: false,
    query: '',
    filter: null,
    from: 0,
    sort: DEFAULT_SEARCH_SORT
  }, action) {
  switch (action.type) {
    case REQUEST_SEARCH_RESULTS:
      return Object.assign({}, state, {
        isFetching: true
      });
    case RECEIVE_SEARCH_RESULTS:
      return Object.assign({}, state, {
        isFetching: false,
        results: action.results
      });
    case INPUT_SEARCH_QUERY:
      return Object.assign({}, state, {
        query: action.query,
        from: 0
      });
    case CHANGE_FILTER:
      return Object.assign({}, state, {
        filter: action.filter,
        from: 0
      });
    case SELECT_SEARCH_OFFSET:
      return Object.assign({}, state, {
        from: action.offset
      });
    case SELECT_SORT_TYPE:
      return Object.assign({}, state, {
        sort: action.sortType,
        from: 0
      });
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  selectImagesModal,
  selectedImages,
  search
});

export default rootReducer;
