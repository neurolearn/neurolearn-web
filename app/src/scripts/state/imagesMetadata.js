import omit from 'lodash/object/omit';
import request from 'superagent';

export const RESET_IMAGES_METADATA = 'RESET_IMAGES_METADATA';
export const REQUEST_IMAGES_METADATA = 'REQUEST_IMAGES_METADATA';
export const RECEIVE_IMAGES_METADATA = 'RECEIVE_IMAGES_METADATA';

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

const propsToOmit = ['collection', 'cognitive_paradigm_cogatlas_id', 'description', 'add_date', 'is_thresholded',
                     'perc_bad_voxels', 'perc_voxels_outside', 'reduced_representation', 'thumbnail', 'not_mni',
                     'statistic_parameters', 'smoothness_fwhm', 'contrast_definition', 'contrast_definition_cogatlas',
                     'figure', 'modify_date'];

export default function reducer(state = {
  isFetching: false,
  items: []
}, action) {
  switch (action.type) {
    case RESET_IMAGES_METADATA:
    case REQUEST_IMAGES_METADATA:
      return {
        isFetching: true,
        items: []
      };
    case RECEIVE_IMAGES_METADATA:
      return {
        isFetching: false,
        items: action.results.map((item) => omit(item, propsToOmit))
      };
    default:
      return state;
  }
}
