/* @flow */

import { debounce, values, isEmpty } from 'lodash';
import { createAction } from 'redux-actions';
import type { Action } from '.';

import api from '../api';

import { RESULTS_PER_PAGE, DEFAULT_SEARCH_SORT } from '../constants/Search';

import SearchSortTypes from '../constants/SearchSortTypes';

export const REQUEST_SEARCH_RESULTS = 'REQUEST_SEARCH_RESULTS';
export const RECEIVE_SEARCH_RESULTS = 'RECEIVE_SEARCH_RESULTS';
export const INPUT_SEARCH_QUERY = 'INPUT_SEARCH_QUERY';
export const CHANGE_FILTER = 'CHANGE_FILTER';
export const SELECT_SEARCH_OFFSET = 'SELECT_SEARCH_OFFSET';
export const SELECT_SORT_TYPE = 'SELECT_SORT_TYPE';
export const RESET_SEARCH = 'RESET_SEARCH';

const requestSearchResults = createAction(REQUEST_SEARCH_RESULTS);
const receiveSearchResults = createAction(RECEIVE_SEARCH_RESULTS);

export const inputSearchQuery = createAction(INPUT_SEARCH_QUERY);
export const selectSearchOffset = createAction(SELECT_SEARCH_OFFSET);
export const selectSortType = createAction(SELECT_SORT_TYPE);
export const changeFilter = createAction(CHANGE_FILTER);
export const resetSearch = createAction(RESET_SEARCH);


function sortOption(sortType) {
  return SearchSortTypes[sortType].option;
}

function combineFilters(filters) {
  return {'and': values(filters)};
}

function prepareSearchParams(state) {
  const query = state.query
    ? {
      'multi_match': {
        'type': 'phrase_prefix',
        'query': state.query,
        'max_expansions': 50,
        'slop': 10,
        'fields': ['name', 'authors', 'description']
      }
    }
    : undefined;

  const filter = !isEmpty(state.filter)
    ? combineFilters(state.filter)
    : undefined;

  const aggs = {
    'number_of_images_stats': {
      'stats': {
        'field': 'number_of_images'
      }
    },

    'image_map_types': {
      'terms': {
        'field': 'image_map_types'
      }
    },
    'image_image_types': {
      'terms': {
        'field': 'image_image_types'
      }
    },
    'image_modalities': {
      'terms': {
        'field': 'image_modalities'
      }
    },
    'image_analysis_levels': {
      'terms': {
        'field': 'image_analysis_levels'
      }
    },
    'has_DOI': {
      'filter': {
        'exists': { 'field': 'DOI'}
      }
    }
  };

  return {
    query: {
      filtered: {
        query: query,
        filter: filter
      }
    },
    aggs: aggs,
    sort: sortOption(state.sort),
    from: state.from,
    size: RESULTS_PER_PAGE
  };
}

function fetchSearchResults(dispatch, state) {
  const searchParams = prepareSearchParams(state);
  return api.post('/search', searchParams).then(
    result => dispatch(receiveSearchResults(result))
  );
}

const debouncedFetchSearchResults = debounce(fetchSearchResults, 300);

export function loadSearchResults(action: Action) {
  return (dispatch: Function, getState: Function) => {
    dispatch(requestSearchResults());
    dispatch(action);
    return debouncedFetchSearchResults(dispatch, getState().search);
  };
}

type SearchStateType = {
  isFetching: boolean,
  query: string,
  filter: Object,
  from: number,
  sort: string
};

const initialState: SearchStateType = {
  isFetching: false,
  query: '',
  filter: {},
  from: 0,
  sort: DEFAULT_SEARCH_SORT
};

export default function reducer(state: SearchStateType = initialState, action: Action) {
  switch (action.type) {
    case REQUEST_SEARCH_RESULTS:
      return Object.assign({}, state, {
        isFetching: true
      });
    case RECEIVE_SEARCH_RESULTS:
      return Object.assign({}, state, {
        isFetching: false,
        results: action.payload
      });
    case INPUT_SEARCH_QUERY:
      return Object.assign({}, state, {
        query: action.payload,
        from: 0
      });
    case CHANGE_FILTER:
      return Object.assign({}, state, {
        filter: action.payload,
        from: 0
      });
    case SELECT_SEARCH_OFFSET:
      return Object.assign({}, state, {
        from: action.payload
      });
    case SELECT_SORT_TYPE:
      return Object.assign({}, state, {
        sort: action.payload,
        from: 0
      });
    case RESET_SEARCH:
      return initialState;
    default:
      return state;
  }
}

