/* @flow */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import { Modal, Button, Input } from 'react-bootstrap';
import sortBy from 'lodash/collection/sortBy';
import every from 'lodash/collection/every';
import isEmpty from 'lodash/lang/isEmpty';

import { filterImagesByName } from '../utils';
import Spinner from './Spinner';
import ImageItem from './ImageItem';
import Events from '../utils/events';

import styles from './SelectImagesModal.scss';

import {
  loadCollectionImages
} from '../state/collectionImages';

class SelectImagesModal extends React.Component {
  state: {
    filterText: string
  };

  static propTypes = {
    collection: PropTypes.object.isRequired,
    collectionImages: PropTypes.object,
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

  componentDidMount() {
    const { collection, collectionImages } = this.props;

    if (!collectionImages[collection._source.id]) {
      const { id, number_of_images } = this.props.collection._source;
      this.props.dispatch(loadCollectionImages(id, number_of_images));
    }
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
          <ImageItem
            {...image}
            checked={this.isImageSelected(image.url)}
            onChange={() => this.props.onToggle(collection, image.url)}
          />
        )}
      </tbody>
    );
  }

  renderLoading() {
    return (
      <div className="row">
        <div className="col-md-12" >
          <div style={{'paddingTop': 30, 'height': 30}}><Spinner opts={{position: 'relative'}} /></div>
          <div style={{'color': 'gray', 'margin': 40, 'textAlign': 'center'}}>Loading image metadata…</div>
        </div>
      </div>
    );
  }

  renderTable(collection, images, selectedImages) {
    const filteredImages = collection && filterImagesByName(this.state.filterText, images);

    const allFilteredAreSelected = selectedImages && every(filteredImages, image => {
      return selectedImages[image.url];
    });

    return (
      <div className={styles.root}>
        <Input
          type="text"
          placeholder="Filter Images"
          value={this.state.filterText}
          ref="filterText"
          onChange={this.handleFilterChange}
        />

        <table className="table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={allFilteredAreSelected}
                  onChange={e => this.toggleList(e, filteredImages)}
                />
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
    );
  }

  render() {
    const { collection, selectedImages, collectionImages } = this.props;
    const images = collectionImages[collection._source.id];

    return (
      <Modal {...this.props} bsSize="large" aria-labelledby="contained-modal-title-lg">
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-lg">Select Images</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {collectionImages.isFetching && this.renderLoading()}
            {!isEmpty(images) &&
              this.renderTable(collection, images, selectedImages)}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.onHide}>Close</Button>
          {this.props.children}
        </Modal.Footer>
      </Modal>
    );
  }
}

function select(state) {
  return state;
}

export default connect(select)(SelectImagesModal);

