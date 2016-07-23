/* @flow */

import update from 'react/lib/update';
import pick from 'lodash/object/pick';
import without from 'lodash/array/without';
import isEmpty from 'lodash/lang/isEmpty';
import pluck from 'lodash/collection/pluck';
import keys from 'lodash/object/keys';
import difference from 'lodash/array/difference';
import zip from 'lodash/array/zip';
import union from 'lodash/array/union';

import { createAction } from 'redux-actions';

import { findColumnIndex } from '../utils';
import api from '../api';
import { apiError } from './alertMessages';

export const RESET_IMAGES_METADATA = 'RESET_IMAGES_METADATA';
export const REQUEST_IMAGES_METADATA = 'REQUEST_IMAGES_METADATA';
export const RECEIVE_IMAGES_METADATA = 'RECEIVE_IMAGES_METADATA';
export const SAVE_IMAGES_METADATA_COLUMN = 'SAVE_IMAGES_METADATA_COLUMN';
export const DELETE_IMAGES_METADATA_COLUMN = 'DELETE_IMAGES_METADATA_COLUMN';

const excludeProps = ['collection', 'cognitive_paradigm_cogatlas_id', 'description', 'add_date', 'is_thresholded',
                      'perc_bad_voxels', 'brain_coverage', 'perc_voxels_outside', 'reduced_representation', 'thumbnail',
                      'not_mni', 'statistic_parameters', 'smoothness_fwhm', 'contrast_definition', 'file_size',
                      'contrast_definition_cogatlas', 'figure', 'modify_date'];

const mandatoryProps = ['id', 'collection_id', 'file', 'name'];


export function resetImagesMetadata() {
  return {
    type: RESET_IMAGES_METADATA
  };
}

function requestImagesMetadata() {
  return {
    type: REQUEST_IMAGES_METADATA
  };
}

function receiveImagesMetadata(items) {
  return {
    type: RECEIVE_IMAGES_METADATA,
    items
  };
}

export const saveImagesMetadataColumn = createAction(SAVE_IMAGES_METADATA_COLUMN);
export const deleteImagesMetadataColumn = createAction(DELETE_IMAGES_METADATA_COLUMN);

function filterImages(imageMap, imageList) {
  return imageList.filter(image => imageMap[image.url]);
}

function baseFilename(imageUrl) {
  return imageUrl.replace(/.*?images\/\d+\//, '');
}

function setExtraProps(collectionId, imageList) {
  return imageList.map(item => update(item, {
    file: {$apply: baseFilename},
    'collection_id': {$set: collectionId}
  }));
}

function withFirst(frontItems, items) {
  return frontItems.concat(without(items, ...frontItems));
}

function convertToArrayOfArrays(items) {
    const keys = withFirst(mandatoryProps, Object.keys(items[0]));
    return [keys].concat(items.map(item => keys.map(key => item[key])));
}

export function loadImagesMetadata(imageMap) {
  return dispatch => {
    dispatch(requestImagesMetadata());
    const imageMetadataPromises = Object.keys(imageMap).map(collectionId => {
      return new Promise((resolve, reject) => {
        api.get(`/nvproxy/api/collections/${collectionId}/images/`)
          .then(
            result => resolve([collectionId, result]),
            error => reject([collectionId, error])
        );
      });
    });
    return Promise.all(imageMetadataPromises).then(results => {
      const items = results.reduce((accum, r) => {
        const [collectionId, response] = r;
        return accum.concat(setExtraProps(collectionId,
          filterImages(imageMap[collectionId],
                       response.results)));
      }, []);
      dispatch(receiveImagesMetadata(items));
    })
    .catch(error => dispatch(apiError(error)));
  };
}

function isInvariant(items) {
  if (isEmpty(items)) {
    return true;
  };
  const first = items[0];
  for(let i = 1; i < items.length; i += 1) {
    if (items[i] != first) {
      return false;
    }
  }
  return true;
}

export default function reducer(state = {
  isFetching: false,
  data: []
}, action) {
  switch (action.type) {
    case RESET_IMAGES_METADATA:
    case REQUEST_IMAGES_METADATA:
      return {
        isFetching: true,
        data: []
      };
    case RECEIVE_IMAGES_METADATA:
      const { items } = action;

      const allowProps = difference(items.length ? keys(items[0]) : [],
                                    union(mandatoryProps, excludeProps));
      const invariantProps = allowProps.filter(prop => isInvariant(pluck(items, prop)));
      const pickedProps = union(mandatoryProps, difference(allowProps, invariantProps));

      return {
        isFetching: false,
        data: convertToArrayOfArrays(
          action.items.map((item) => pick(item, pickedProps)))
      };

    case SAVE_IMAGES_METADATA_COLUMN:
      const { data } = state;
      const { name, values } = action.payload;
      const columnIndex = findColumnIndex(data, name);

      return columnIndex > -1
        ? {...state,
            data: [data[0]].concat(
              zip(data.slice(1), values)
              .map(x => update(x[0], {$splice: [[columnIndex, 1, x[1]]]}))
            )}
        : {...state,
            data: zip(data, [name].concat(values))
                  .map(x => x[0].concat(x[1]))};

    case DELETE_IMAGES_METADATA_COLUMN:
      const { data } = state;

      const columnIndex = findColumnIndex(data, action.payload);

      return {
        ...state,
        data: data.map(x => update(x, {$splice: [[columnIndex, 1]]}))
      };

    default:
      return state;
  }
}
