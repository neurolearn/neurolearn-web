import styles from './SearchResult.scss';

import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import FallbackImage from '../FallbackImage';
import { pluralize } from '../../utils.js';


export default class SearchResult extends React.Component {
  static propTypes = {
    hit: PropTypes.object,
    onClick: PropTypes.func.isRequired
  }

  render() {
    var { id, name, number_of_images, images, authors } = this.props.hit._source;

    var thumbnail;

    if (images.length) {
      thumbnail = images[0].thumbnail;
    }

    return (
      <div className={styles.root}>
        <div className="row">
          <div className="title">
            <h3>{name}</h3>
            <p>{authors}</p>
            <p><a href={`http://neurovault.org/collections/${id}/`} target="_blank"><i style={{paddingRight: 2}} className="fa fa-external-link"></i>NeuroVault</a></p>
          </div>
          <div className="images">
            <FallbackImage src={thumbnail} className="img-responsive" />
            <div className="number-of-images">{number_of_images} {pluralize(number_of_images, 'image', 'images')}</div>
          </div>
          <div className="button">
            <Button bsStyle='default' onClick={this.props.onClick}>Select Images</Button>
          </div>
        </div>
      </div>
    );
  }
}
