import React, { PropTypes } from 'react';

export default class ImageList extends React.Component {
  static propTypes = {
    selectedImages: PropTypes.object,
    selectedCollections: PropTypes.array,
    onItemClick: PropTypes.func
  }

  handleItemClick(e, collectionId) {
    e.preventDefault();
    this.props.onItemClick(collectionId);
    return false;
  }

  renderCollection(collection, selectedImages) {
    return (
      <div>
        <a href="#" onClick={(e) =>this.handleItemClick(e, collection._id)}>{collection._source.name}</a>
        <ul>
        </ul>
      </div>
    );
  }

  render() {
    const { selectedCollections, selectedImages } = this.props;

    return (
      <div>
        {selectedCollections.map((collection) =>
          this.renderCollection(collection, selectedImages[collection._id]))}
      </div>
    );
  }
}
