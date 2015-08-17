import React, { PropTypes } from 'react';
import { Modal, Button, Input } from 'react-bootstrap';
import ImageItem from './ImageItem';

export default class SelectImagesModal extends React.Component {
  static propTypes = {
    collection: PropTypes.object.isRequired,
    selectedImages: PropTypes.object.isRequired,
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

  toggleAll(e) {
    this.props.onToggleAll(this.props.collection, e.target.checked);
  }

  renderImages(images) {
    const { collection } = this.props;
    return (
      <ul>
        {images.map((image) =>
          <ImageItem {...image}
                     key={image.url}
                     checked={this.isImageSelected(image.url)}
                     onChange={() => this.props.onToggle(collection, image.url)} />
        )}
      </ul>
    );
  }

  render() {
    const { collection, selectedImages } = this.props;
    const selectedCount = selectedImages && Object.keys(selectedImages).reduce(function (accum, key) {
      return selectedImages[key] ? accum + 1 : accum;
    }, 0);

    const isAllSelected = collection
                        && (collection._source.images.length === selectedCount);

    return (
      <Modal {...this.props} bsSize='large' aria-labelledby='contained-modal-title-lg'>
        <Modal.Header closeButton>
          <Modal.Title id='contained-modal-title-lg'>Select Images</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Input type='checkbox'
               label='Select All Images'
               onChange={this.toggleAll.bind(this)}
               checked={isAllSelected} />

        {collection && this.renderImages(collection._source.images)}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
