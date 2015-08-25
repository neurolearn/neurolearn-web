import cloneDeep from 'lodash/lang/cloneDeep';
import update from 'react/lib/update';

export const TOGGLE_IMAGE = 'TOGGLE_IMAGE';
export const TOGGLE_ALL_IMAGES = 'TOGGLE_ALL_IMAGES';

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

function allImagesToggle(state, collection, checked) {
  const images = collection._source.images.reduce(function(accum, image) {
    accum[image.url] = checked;
    return accum;
  }, {});

  return update(state, {
    images: {[collection._id]: {$set: images}},
    collectionsById: {$merge: {[collection._id]: cloneDeep(collection)}}
  });
}

function imageToggle(state, collection, imageId) {
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

  return update(state, {
    images: {[collection._id]: {$apply: toggle}},
    collectionsById: {$merge: {[collection._id]: cloneDeep(collection)}}
  });
}

export default function reducer(state = { images: {}, collectionsById: {} }, action) {
  switch (action.type) {
    case TOGGLE_IMAGE:
      return imageToggle(state, action.collectionId, action.imageId);

    case TOGGLE_ALL_IMAGES:
      return allImagesToggle(state, action.collectionId, action.imageList,
                             action.checked);

    default:
      return state;
  }
}