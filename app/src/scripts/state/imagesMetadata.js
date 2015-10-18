import update from 'react/lib/update';
import omit from 'lodash/object/omit';
import api from '../api';

export const RESET_IMAGES_METADATA = 'RESET_IMAGES_METADATA';
export const REQUEST_IMAGES_METADATA = 'REQUEST_IMAGES_METADATA';
export const RECEIVE_IMAGES_METADATA = 'RECEIVE_IMAGES_METADATA';

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

function receiveImagesMetadata(collectionId, results) {
  return {
    type: RECEIVE_IMAGES_METADATA,
    collectionId,
    results
  };
}

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

export function loadImagesMetadata(imageMap) {
  return dispatch => {
    dispatch(requestImagesMetadata());
    const imageMetadataPromises = Object.keys(imageMap).map(collectionId => {
      return new Promise((resolve, reject) => {
        api.fetchImagesMetadata(collectionId, (err, res) => {
          return err ? reject([collectionId, err]) : resolve([collectionId, res]);
        });
      });
    });
    return Promise.all(imageMetadataPromises).then(results => {
      const items = results.reduce((accum, r) => {
        const [collectionId, response] = r;
        return accum.concat(setExtraProps(collectionId,
          filterImages(imageMap[collectionId],
                       response.body.results)));
      }, []);
      dispatch(receiveImagesMetadata(504, items));
    }).
    catch(err => {
      console.log('Error', err);
    });
  };
}

const propsToOmit = ['collection', 'cognitive_paradigm_cogatlas_id', 'description', 'add_date', 'is_thresholded',
                     'perc_bad_voxels', 'brain_coverage', 'perc_voxels_outside', 'reduced_representation', 'thumbnail',
                     'not_mni', 'statistic_parameters', 'smoothness_fwhm', 'contrast_definition',
                     'contrast_definition_cogatlas', 'figure', 'modify_date'];

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
