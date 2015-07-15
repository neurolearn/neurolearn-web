'use strict';

import styles from './SearchResult.css';

import React from 'react';

export default class SearchResult extends React.Component {

  render() {
    var { name, number_of_images, images, authors } = this.props.hit._source;

    var thumbnail;

    if (images.length) {
      thumbnail = images[0].thumbnail;
    }

    return (
      <div className={styles.root}>
        <div className="row">
          <div className="col-md-9">
            <h3>{name}</h3>
            <div className="row">
              <img src={thumbnail} />
              <p>{authors}</p>
            </div>
          </div>
          <div className="col-md-3">
            <div className="number-of-images"><h3>{number_of_images}</h3></div>
            <div>images</div>
            <button className="btn btn-default">Select Images</button>
          </div>
        </div>
      </div>
    );
  }
}
