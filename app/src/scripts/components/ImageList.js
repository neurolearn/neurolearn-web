import React, { PropTypes } from 'react';

export default class ImageList extends React.Component {
  static propTypes = {
    selectedImages: PropTypes.object
  }

  renderCollection(id, collection) {
    return (
      <div>
        <strong>{id}</strong>
        <ul>
          {Object.keys(collection).map((image) => <li>{image}</li>)}
        </ul>
      </div>
    );
  }

  render() {
    const { selectedImages } = this.props;

    return (
      <div>
        {Object.keys(selectedImages).map((collection) =>
          this.renderCollection(collection, selectedImages[collection]))}
      </div>
    );
  }
}
