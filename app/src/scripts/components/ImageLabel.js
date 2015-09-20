import React, { PropTypes } from 'react';

export default class ImageLabel extends React.Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
    collections: PropTypes.object.isRequired
  }

  render() {
    return (
      <div>
        <h3>{this.props.item.name}</h3>
       {/* <p style={{marginRight: 5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{this.collectionNameById(item.collection_id)}</p> */}
      </div>
    );
  }
}
