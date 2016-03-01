import classNames from 'classnames';
import React, { PropTypes } from 'react';
import { Modal, Button, Input } from 'react-bootstrap';
import sortBy from 'lodash/collection/sortBy';

import ImageItem from './ImageItem';

import styles from './SelectImagesModal.scss';

export default class SelectImagesModal extends React.Component {
  static propTypes = {
    collection: PropTypes.object.isRequired,
    selectedImages: PropTypes.object,
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
      <tbody>
        {sortBy(images, 'name').map((image) =>
          <ImageItem {...image}
                     key={image.url}
                     checked={this.isImageSelected(image.url)}
                     onChange={() => this.props.onToggle(collection, image.url)} />
        )}
      </tbody>
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
        <div className={styles.root}>
          <table className="table">
            <thead>
              <tr>
                <th>
                  <input type="checkbox" checked={isAllSelected} onChange={this.toggleAll.bind(this)} />
                </th>
                <th className="col-md-4">Name</th>
                <th className="col-md-2">Image Type</th>
                <th>Map Type</th>
                <th className="col-md-4"></th>
              </tr>
            </thead>
            {collection && this.renderImages(collection._source.images)}
          </table>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.onHide}>Close</Button>
          {this.props.children}
        </Modal.Footer>
      </Modal>
    );
  }
}
