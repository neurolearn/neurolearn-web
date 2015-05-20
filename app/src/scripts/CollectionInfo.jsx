'use strict';

import React from 'react';

export default class CollectionInfo extends React.Component {
  render() {
    return (
      <div className="collectionInfo">
        {this.props.collection.id}<br/>
        {this.props.collection.name}
      </div>
    );
  }
}
