import React, { PropTypes } from 'react';

export default class ImageBarChart extends React.Component {
  static propTypes = {
    images: PropTypes.array.isRequired,
    collections: PropTypes.object.isRequired
  }

  collectionNameById(id) {
    return this.props.collections[id].name;
  }

  render() {
    const { images } = this.props;
    return (
      <div>
        {images.map(image => <div><h3>{image.name}</h3><p>{this.collectionNameById(image.collection_id)}</p> {image.r}</div>)}
      </div>
    );
  }
}
