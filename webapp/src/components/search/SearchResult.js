/* @flow */

import styles from './SearchResult.scss';

import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import FallbackImage from '../FallbackImage';
import { pluralize,  neuroVaultCollectionURL } from '../../utils.js';

function firstImageThumbnail(images: Array<{thumbnail: string}>): string {
  return images.length ? images[0].thumbnail : '';
}

const SearchResult = (props : { hit: Object, onClick: () => void }) => {
  const { id, name, number_of_images, images, authors } = props.hit._source;

  return (
    <div className={styles.root}>
      <div className="row">
        <div className="title">
          <h3>{name}</h3>
          <p>{authors}</p>
          <p><a href={neuroVaultCollectionURL(id)} target="_blank"><i style={{paddingRight: 2}} className="fa fa-external-link"></i>NeuroVault</a></p>
        </div>
        <div className="images">
          <FallbackImage src={firstImageThumbnail(images)} className="img-responsive" />
          <div className="number-of-images">{number_of_images} {pluralize(number_of_images, 'image', 'images')}</div>
        </div>
        <div className="button">
          <Button bsStyle="default" onClick={props.onClick}>Select Images</Button>
        </div>
      </div>
    </div>
  );
}

SearchResult.propTypes = {
  hit: PropTypes.object,
  onClick: PropTypes.func.isRequired
};

export default SearchResult;

