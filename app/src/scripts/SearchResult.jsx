'use strict';

import React from 'react';

export default class SearchResult extends React.Component {

  render() {
    var { name, number_of_images, thumbnail } = this.props.hit._source;

    return (
      <div className="row" style={{border: '1px solid gray'}}>
        <div className="col-md-9">
          <h3>{name}</h3>
          <img src={thumbnail} />
        </div>
        <div className="col-md-3">
          <div>{number_of_images}</div>
          <div>images</div>
        </div>
      </div>
    );
  }
}
