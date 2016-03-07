import { JWT_KEY_NAME } from './constants/auth';

export function pluralize(n, singular, plural) {
  return (n !== 1) ? plural : singular;
}

export function getAuthToken() {
  return localStorage.getItem(JWT_KEY_NAME);
}

export function removeAuthToken() {
  return localStorage.removeItem(JWT_KEY_NAME);
}
