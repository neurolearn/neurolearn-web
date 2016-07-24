/* @flow */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import SearchContainer from '../search/SearchContainer';
import SelectImagesModal from '../SelectImagesModal';
import SelectedCollectionList from '../SelectedCollectionList';
import { Link } from 'react-router';

import {resetImagesMetadata } from '../../state/imagesMetadata';

import {
  showSelectImagesModal,
  hideSelectImagesModal
} from '../../state/selectImagesModal';

import {
  toggleImage,
  toggleImageList
} from '../../state/selectedImages';

import {
  loadSearchResults,
  inputSearchQuery,
} from '../../state/search';

import styles from './InputData.scss';

class InputData extends React.Component {
  static propTypes = {
    search: PropTypes.object,
    selectImagesModal: PropTypes.object,
    selectedImages: PropTypes.object,
    dispatch: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    (this:any).handleCollectionClick = this.handleCollectionClick.bind(this);
  }

  componentDidMount() {
    if (!this.props.search.results) {
      this.props.dispatch(loadSearchResults(inputSearchQuery('')));
    }
  }

  handleImageToggle(collection, imageId) {
    this.props.dispatch(toggleImage(collection, imageId));
    this.props.dispatch(resetImagesMetadata());
  }

  handleImageListToggle(collection, images, checked) {
    this.props.dispatch(toggleImageList(collection, images, checked));
    this.props.dispatch(resetImagesMetadata());
  }

  getCollection(collectionId, collectionsById) {
    const { results } = this.props.search;
    let collection = collectionsById[collectionId];

    if (collection) {
      return collection;
    }

    if (!results) {
      return null;
    }

    collection = results.hits.hits.filter(function (item) {
      return item._id === collectionId;
    })[0];

    return collection;
  }

  getSelectedImagesInCollection(selectedImages, collectionId) {
    return selectedImages[collectionId];
  }

  countSelectedInCollection(collection) {
    if (!collection) {
      return 0;
    }
    return Object.keys(collection).reduce((accum, key) =>
      collection[key] ? accum + 1 : accum,
    0);
  }

  countSelectedImages(selectedImages) {
    return Object.keys(selectedImages).reduce((accum, key) =>
      this.countSelectedInCollection(selectedImages[key]) + accum,
    0);
  }

  handleCollectionClick(id) {
    this.props.dispatch(showSelectImagesModal(id));
  }

  render() {
    const { selectImagesModal, selectedImages, dispatch } = this.props;
    const anySelected = this.countSelectedImages(selectedImages.images) === 0;

    return (
      <div className={styles.root}>
        <h1 className="page-header">Input Data</h1>
        <p className="lead">Search NeuroVault collections and select images to create a training dataset.</p>

        <div className="row">
          <div className="col-md-9">
            <SearchContainer
              {...this.props.search}
              dispatch={this.props.dispatch}
              onSearchResultClick={this.handleCollectionClick}
            />
          </div>

          <div className="col-md-3">
            <div className="panel panel-default">
              <div className="panel-heading">
                <h3 className="panel-title">Selected Images</h3>
              </div>
              <div className={classNames('panel-body', anySelected && 'empty-dataset')}>
                { anySelected
                  ? <p>Training dataset is empty.</p>
                  : <SelectedCollectionList
                      selectedImages={selectedImages}
                      onItemClick={this.handleCollectionClick}
                    />
                }
                <Link
                  disabled={anySelected}
                  className="btn btn-primary btn-block continue-button"
                  to="/models/new/training-label">Continue to Training Label</Link>
              </div>
            </div>
          </div>
        </div>
        {selectImagesModal.collectionId &&
          <SelectImagesModal
            show={selectImagesModal.display}
            onToggle={(collection, imageId) =>
                        this.handleImageToggle(collection, imageId)}
            onToggleList={(collection, images, checked) =>
                        this.handleImageListToggle(collection, images,
                                                   checked)}
            collection={this.getCollection(selectImagesModal.collectionId,
                                           selectedImages.collectionsById)}
            selectedImages={this.getSelectedImagesInCollection(selectedImages.images,
                                                               selectImagesModal.collectionId)}
            onHide={() => dispatch(hideSelectImagesModal())}
          >
            <Link disabled={anySelected} className="btn btn-primary continue-button" to="/models/new/training-label">Continue to Training Label</Link>
          </SelectImagesModal>
        }
      </div>
    );
  }
}

function select(state) {
  return state;
}

export default connect(select)(InputData);
