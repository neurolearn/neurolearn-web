import styles from './SearchResult.scss';

import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';

export default class SearchResult extends React.Component {
  static propTypes = {
    hit: PropTypes.object,
    onClick: PropTypes.func.isRequired
  }

  render() {
    var { name, number_of_images, images, authors } = this.props.hit._source;

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
          </div>
          <div className="images">
            <img src={thumbnail} className="img-responsive" />
            <div className="number-of-images">{number_of_images} images</div>
          </div>
          <div className="button">
            <Button bsStyle='primary' onClick={this.props.onClick}>Select Images</Button>
          </div>
        </div>
      </div>
    );
  }
}
