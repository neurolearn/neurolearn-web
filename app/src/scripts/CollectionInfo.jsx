'use strict';

import React from 'react';

export default class CollectionInfo extends React.Component {
  render() {
    var collection = this.props.collection;
    return (
      <div className="collectionInfo row">
        <div className="col-md-6 well">
        <h3>{collection.name}</h3>
        <p>{collection.description}</p>
        <p><a href={'http://neurovault.org/collections/' + this.props.collectionId}>neurovault.org/collections/{this.props.collectionId}</a></p>
        </div>
      </div>
    );
  }
}
