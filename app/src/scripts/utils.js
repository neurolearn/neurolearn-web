import { JWT_KEY_NAME } from './constants/auth';
import isEmpty from 'lodash/lang/isEmpty';

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
