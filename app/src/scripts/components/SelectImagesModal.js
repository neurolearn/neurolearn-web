import React, { PropTypes } from 'react';
import { Modal, Button, Input } from 'react-bootstrap';
import ImageItem from './ImageItem';

export default class SelectImagesModal extends React.Component {
  static propTypes = {
    collection: PropTypes.object.isRequired,
    selectedImages: PropTypes.array.isRequired,
    onToggle: PropTypes.func.isRequired,
    onToggleAll: PropTypes.func.isRequired,
    onHide: PropTypes.func.isRequired
  }

  isImageSelected(key) {
    const { selectedImages } = this.props;
    if (selectedImages) {
      return selectedImages[key];
    }
    return false;
  }

  renderImages(images) {
    const collectionId = this.props.collection._id;
    return (
      <ul>
        {images.map((image) =>
          <ImageItem {...image}
                     key={image.url}
                     checked={this.isImageSelected(image.url)}
                     onChange={() => this.props.onToggle(collectionId, image.url)} />
        )}
      </ul>
    );
  }

  render() {
    let collection = this.props.collection && this.props.collection._source;

    return (
      <Modal {...this.props} bsSize='large' aria-labelledby='contained-modal-title-lg'>
        <Modal.Header closeButton>
          <Modal.Title id='contained-modal-title-lg'>Select Images</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Input type='checkbox' label='Select All Images' onChange={this.props.onToggleAll} />

        {collection && this.renderImages(collection.images)}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
