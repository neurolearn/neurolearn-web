/* @flow */

import React, { PropTypes } from 'react';
import { Checkbox } from 'react-bootstrap';

import { neuroVaultImageURL } from '../utils';

import styles from './ImageLabel.scss';

const ImageLabel = (
  { item, showCheckbox, isChecked, onChange }
: { item: {id: number,
           name: string,
           collectionName: string },
    showCheckbox: boolean,
    isChecked: (id: number) => boolean,
    onChange: (id: number, checked: boolean) => void }
) => (
  <div className={styles.root}>
    {showCheckbox &&
      <Checkbox
        checked={isChecked(item.id)}
        onChange={e => onChange(item.id, e.target.checked)}
        inline
      />
    }
    <div className="image-name"><a href={neuroVaultImageURL(item.id)}>{item.name}</a></div>
    <p className="collection-name">{item.collectionName}</p>
  </div>
);

ImageLabel.propTypes = {
  item: PropTypes.object.isRequired,
  showCheckbox: PropTypes.bool,
  isChecked: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired
};

export default ImageLabel;
