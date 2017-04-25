/* @flow */

import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import FallbackImage from '../FallbackImage';
import { pluralize, neuroVaultCollectionURL } from '../../utils';

import styles from './SearchResult.scss';

function firstImageThumbnail(images: Array<{ thumbnail: string }>): string {
  return images.length ? images[0].thumbnail : '';
}

const SearchResult = (props: { source: Object, onClick: () => void }) => {
  const {
    id,
    name,
    number_of_images: numberOfImages,
    sample_images: images,
    authors,
    private: isPrivate
  } = props.source;

  return (
    <div className={styles.root}>
      <div className="row">
        <div className="title">
          <h3>
            {name}
            {isPrivate &&
              <i
                title="Private collection"
                className="fa fa-lock"
                style={{ marginLeft: 4, color: 'gray' }}
                aria-hidden="true"
                key="lock"
              />}
          </h3>
          <p>{authors}</p>
          <p>
            <a href={neuroVaultCollectionURL(id)} target="_blank">
              <i style={{ paddingRight: 2 }} className="fa fa-external-link" />
              NeuroVault
            </a>
          </p>
        </div>
        <div className="images">
          {images &&
            <FallbackImage
              src={firstImageThumbnail(images)}
              className="img-responsive"
            />}
          <div className="number-of-images">
            {numberOfImages} {pluralize(numberOfImages, 'image', 'images')}
          </div>
        </div>
        <div className="button">
          <Button bsStyle="default" onClick={props.onClick}>
            Select Images
          </Button>
        </div>
      </div>
    </div>
  );
};

SearchResult.propTypes = {
  source: PropTypes.object,
  onClick: PropTypes.func.isRequired
};

export default SearchResult;
