import { JWT_KEY_NAME } from './constants/auth';
import isEmpty from 'lodash/lang/isEmpty';
import every from 'lodash/collection/every';
import pick from 'lodash/object/pick';
import take from 'lodash/array/take';

export function pluralize(n, singular, plural) {
  return (n !== 1) ? plural : singular;
}

export function getAuthToken() {
  return localStorage.getItem(JWT_KEY_NAME);
}

export function removeAuthToken() {
  return localStorage.removeItem(JWT_KEY_NAME);
}

export function filterImagesByName(text, images) {
  if (isEmpty(text)) {
    return images;
  } else {
    const regex = new RegExp(text, 'i');
    return images.filter(image => image.name.search(regex) > -1);
  }
}

export function neuroVaultImageURL(imageId) {
  return `http://neurovault.org/images/${imageId}/`;
}

function columnValues(data, index) {
  return data.slice(1).map((row, i) => row[index]);
}

// Thanks, jQuery
function isNumeric(obj) {
  const type = typeof(obj);
  return (type === 'number' || type === 'string') && !isNaN(obj - parseFloat(obj));
}

function guessType(values) {
  return every(values, isNumeric) ? 'Number' : 'Categorical';
}

export function parseColumns(data) {
  return data[0].map((column, i) => {
    const values = columnValues(data, i);
    return {
      'name': column,
      'dataType': guessType(values),
      'sampleValues': take(values, 3)
    }
  });
}
