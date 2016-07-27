/* @flow */

import classNames from 'classnames';
import React, { PropTypes } from 'react';
import { Modal, Button, Input } from 'react-bootstrap';
import sortBy from 'lodash/collection/sortBy';
import every from 'lodash/collection/every';

import { filterImagesByName } from '../utils';
import ImageItem from './ImageItem';
import Events from '../utils/events';

import styles from './SelectImagesModal.scss';

export default class SelectImagesModal extends React.Component {
  state: {
    filterText: string
  };

  static propTypes = {
    collection: PropTypes.object.isRequired,
    selectedImages: PropTypes.object,
    onToggle: PropTypes.func.isRequired,
    onToggleList: PropTypes.func.isRequired,
    onHide: PropTypes.func.isRequired,
    children: React.PropTypes.node
  }

  constructor(props: Object) {
    super(props);
    this.state = {
      filterText: ''
    };
    (this:any).handleFilterChange = this.handleFilterChange.bind(this);
  }

  handleFilterChange() {
    this.setState({
      filterText: this.refs.filterText.getValue()
    });
  }

  isImageSelected(key: string) {
    const { selectedImages } = this.props;
    if (selectedImages) {
      return selectedImages[key];
    }
    return false;
  }

  toggleList(e: SyntheticEvent, filteredImages: Array<{}>) {
    this.props.onToggleList(
      this.props.collection,
      filteredImages,
      Events.target(e, HTMLInputElement).checked
    );
  }

  renderImages(images: Array<{url: string}>) {
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
    const filteredImages = collection && filterImagesByName(this.state.filterText, collection._source.images);

    const allFilteredAreSelected = selectedImages && every(filteredImages, image => {
      return selectedImages[image.url];
    });

    return (
      <Modal {...this.props} bsSize='large' aria-labelledby='contained-modal-title-lg'>
        <Modal.Header closeButton>
          <Modal.Title id='contained-modal-title-lg'>Select Images</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Input type="text"
          placeholder="Filter Images"
          value={this.state.filterText}
          ref="filterText"
          onChange={this.handleFilterChange} />

        <div className={styles.root}>

          <table className="table">
            <thead>
              <tr>
                <th>
                  <input type="checkbox" checked={allFilteredAreSelected} onChange={e => this.toggleList(e, filteredImages)} />
                </th>
                <th className="col-md-4">Name</th>
                <th className="col-md-2">Image Type</th>
                <th>Map Type</th>
                <th className="col-md-4"></th>
              </tr>
            </thead>
            {filteredImages && this.renderImages(filteredImages)}
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
