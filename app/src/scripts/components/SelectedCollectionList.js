import React, { PropTypes } from 'react';

export default class SelectedCollectionList extends React.Component {
  static propTypes = {
    selectedImages: PropTypes.object,
    onItemClick: PropTypes.func
  }

  handleItemClick(e, collectionId) {
    e.preventDefault();
    this.props.onItemClick(collectionId);
  }

  countSelectedImages(selectedImages) {
    return Object.keys(selectedImages).reduce((accum, key) =>
      selectedImages[key] ? accum + 1 : accum,
    0);
  }

  renderCollection(collection, count) {
    return (
      <p>
        <a href="#" onClick={(e) =>this.handleItemClick(e, collection._id)}>{collection._source.name}</a>
        &nbsp;({count})
      </p>
    );
  }

  render() {
    const { images, collectionsById } = this.props.selectedImages;
    return (
      <div>
        {Object.keys(images).map((collectionId) => {
          const count = this.countSelectedImages(images[collectionId]);
          return count
            ? this.renderCollection(collectionsById[collectionId], count)
            : null;
        })}
      </div>
    );
  }
}
