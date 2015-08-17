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

  renderCollection(collection, selectedImages) {
    const countSelected = Object.keys(selectedImages).reduce((accum, key) =>
      selectedImages[key] ? accum + 1 : accum,
    0);

    return (
      <p>
        <a href="#" onClick={(e) =>this.handleItemClick(e, collection._id)}>{collection._source.name}</a>
        &nbsp;({countSelected})
      </p>
    );
  }

  render() {
    const { images, collectionsById } = this.props.selectedImages;

    return (
      <div>
        {Object.keys(images).map((collectionId) =>
          this.renderCollection(collectionsById[collectionId], images[collectionId]))}
      </div>
    );
  }
}
