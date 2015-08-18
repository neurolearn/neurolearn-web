import request from 'superagent';

import { RESULTS_PER_PAGE, DEFAULT_SEARCH_SORT } from '../constants/Search';
import SearchSortTypes from '../constants/SearchSortTypes';

import { SHOW_SELECT_IMAGES_MODAL,
         HIDE_SELECT_IMAGES_MODAL,
         TOGGLE_IMAGE,
         TOGGLE_ALL_IMAGES,
         RECEIVE_SEARCH_RESULTS,
         INPUT_SEARCH_QUERY,
         CHANGE_FILTER,
         SELECT_SEARCH_OFFSET,
         SELECT_SORT_TYPE,
         RESET_IMAGES_METADATA,
         REQUEST_IMAGES_METADATA,
         RECEIVE_IMAGES_METADATA
} from './actionTypes';

export function showSelectImagesModal(collectionId) {
  return {
    type: SHOW_SELECT_IMAGES_MODAL,
    collectionId
  };
}

export function hideSelectImagesModal() {
  return {
    type: HIDE_SELECT_IMAGES_MODAL
  };
}

export function toggleImage(collectionId, imageId) {
  return {
    type: TOGGLE_IMAGE,
    collectionId,
    imageId
  };
}

export function toggleAllImages(collectionId, imageList, checked) {
  return {
    type: TOGGLE_ALL_IMAGES,
    collectionId,
    imageList,
    checked
  };
}

function sortOption(sortType) {
  return SearchSortTypes[sortType].option;
}

function fetchSearchResults(state) {
  const query = state.query
    ? {
      'multi_match': {
        'type': 'phrase_prefix',
        'query': state.query,
        'max_expansions': 50,
        'slop': 10,
        'fields': ['name', 'authors']
      }
    }
    : undefined;

  const filter = state.filter
    ? state.filter
    : undefined;

  const aggs = {
    'number_of_images_stats': {
      'stats': {
        'field': 'number_of_images'
      }
    },
    'handedness': {
      'terms': {
          'field': 'handedness'
      }
    },
    'nested_aggs': {
      'nested': {
        'path': 'images'
      },
      'aggs': {
        'modality': {
          'terms': {
            'field': 'images.modality'
          }
        },
        'map_type': {
          'terms': {
            'field': 'images.map_type'
          }
        }
      }
    }
  };

  return request.post('/search')
    .send({
      query: {
        filtered: {
          query: query,
          filter: filter
        }
      },
      size: RESULTS_PER_PAGE,
      from: state.from,
      sort: sortOption(state.sort),
      aggs: aggs
    })
    .type('json')
    .accept('json');
}

function receiveSearchResults(results) {
  return {
    type: RECEIVE_SEARCH_RESULTS,
    results
  };
}

export function loadSearchResults(action) {
  return (dispatch, getState) => {
    dispatch(action);
    return fetchSearchResults(getState().search)
      .end((err, res) => dispatch(receiveSearchResults(res.body)));
  };
}

export function inputSearchQuery(query) {
  return {
    type: INPUT_SEARCH_QUERY,
    query
  };
}

export function selectSearchOffset(offset) {
  return {
    type: SELECT_SEARCH_OFFSET,
    offset
  };
}

export function selectSortType(sortType) {
  return {
    type: SELECT_SORT_TYPE,
    sortType
  };
}

export function changeFilter(filter) {
  return {
    type: CHANGE_FILTER,
    filter
  };
}

export function resetImagesMetadata() {
  return {
    type: RESET_IMAGES_METADATA
  };
}

function requestImagesMetadata(collectionId) {
  return {
    type: REQUEST_IMAGES_METADATA,
    collectionId
  };
}

function receiveImagesMetadata(collectionId, results) {
  return {
    type: RECEIVE_IMAGES_METADATA,
    collectionId,
    results
  };
}

function fetchImagesMetadata(collectionId) {
  let url = `/nvproxy/api/collections/${collectionId}/images/`;

  return request.get(url);
}

export function loadImagesMetadata(collectionId) {
  return dispatch => {
    dispatch(requestImagesMetadata(collectionId));
    return fetchImagesMetadata(collectionId)
      .end((err, res) => dispatch(receiveImagesMetadata(collectionId, res.body.results)));
  };
}
