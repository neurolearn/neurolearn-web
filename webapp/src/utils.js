/* @flow */

import { JWT_KEY_NAME, NEUROVAULT_DEV_CLIENT_ID } from './constants/auth';
import { algorithmGroups } from './constants/Algorithms';
import isEmpty from 'lodash/lang/isEmpty';
import findKey from 'lodash/object/findKey';
import every from 'lodash/collection/every';
import pick from 'lodash/object/pick';
import keys from 'lodash/object/keys';
import take from 'lodash/array/take';
import findIndex from 'lodash/array/findIndex';

import type { WindowLocation } from './types';

export function pluralize(
  n: number,
  singular: string,
  plural: string
) : string
{
  return (n !== 1) ? plural : singular;
}

export function getAuthToken() {
  return localStorage.getItem(JWT_KEY_NAME);
}

export function removeAuthToken(): void {
  localStorage.removeItem(JWT_KEY_NAME);
}

function nvAuthLink(loc: WindowLocation): string {
    const { protocol, host } = loc;
    const redirectUri = `${protocol}//${host}/signin/authorized`;
    return `http://neurovault.org/o/authorize/?response_type=code&client_id=${NEUROVAULT_DEV_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}`;
}

export function authLink(loc: WindowLocation): string {
    const { host }= loc;
    return /^localhost\b/.test(host)
      ? nvAuthLink(loc)
      : '/signin';
}

export function filterImagesByName(text: string, images: Array<Object>) {
  if (isEmpty(text)) {
    return images;
  } else {
    const regex = new RegExp(text, 'i');
    return images.filter(image => image.name.search(regex) > -1);
  }
}

export function neuroVaultImageURL(imageId: number) {
  return `http://neurovault.org/images/${imageId}/`;
}

export function neuroVaultCollectionURL(collectionId: number) {
  return `http://neurovault.org/collections/${collectionId}/`;
}

function columnValues(data, index) {
  return data.slice(1).map((row, i) => row[index]);
}

export function pickColumn(data: Array<Array<string | number>>, index: number) {
  return data.map(row => row[index]);
}

export function pickColumns(data: Array<Array<string | number>>, columnNames: Array<string>) {
  const indexes = columnNames.map(name => findColumnIndex(data, name));
  return data.map(row => indexes.map(index => row[index]));
}

// Thanks, jQuery
function isNumeric(obj) {
  const type = typeof(obj);
  return (type === 'number' || type === 'string') && !isNaN(obj - parseFloat(obj));
}

export function guessType(values: mixed[]): string {
  return every(values, isNumeric) ? 'Number' : 'Categorical';
}

export function isBinaryCollection<T>(values: T[]): boolean {
  const unique: { [key: T]: number } = {};

  for (let i = 0; i < values.length; i += 1) {
    unique[values[i]] = 1;
    if (keys(unique).length > 2) {
      return false;
    }
  }

  if (keys(unique).length < 2) {
    return false;
  }

  return true;
}

export function getColumnsFromArray(data: Array<Array<string | number>>): Array<Object> {
  return data[0].map((column, i) => {
    const values = columnValues(data, i);
    return {
      'name': column,
      'values': values
    }
  });
}

export function findColumnIndex(
  tableData: Array<Array<string | number>>, colName: string
): number {
  return findIndex(tableData[0], col => col === colName);
}

export function analysisTypeOfAlgorithm(algorithm: string) {
  return findKey(algorithmGroups, x => x.indexOf(algorithm) > -1);
}

export function getFieldData(data: Array<Array<string | number>>, fieldName: string) {
  const idIndex = findColumnIndex(data, 'id');
  const collectionIdIndex = findColumnIndex(data, 'collection_id');
  const nameIndex = findColumnIndex(data, 'name');
  const fieldIndex = findColumnIndex(data, fieldName);

  const fieldData = data
    .slice(1)
    .filter(row => row[idIndex] && row[collectionIdIndex])
    .map(row => {
      return {
        'id': row[idIndex],
        'target': row[fieldIndex],
        'collection_id': row[collectionIdIndex],
        'name': row[nameIndex]
      };
  });

  return {
    field: {
      index: fieldIndex,
      name: fieldName
    },
    data: fieldData
  };
}

