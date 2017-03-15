/* @flow */
import isEmpty from 'lodash/lang/isEmpty';

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { Link } from 'react-router';
import { ButtonToolbar, ButtonGroup, Button } from 'react-bootstrap';
import SearchContainer from 'components/search/SearchContainer';
import MyCollectionsContainer from 'components/MyCollectionsContainer';
import SelectImagesModal from 'components/SelectImagesModal';
import SelectedCollectionList from 'components/SelectedCollectionList';

import { resetImagesMetadata } from 'state/imagesMetadata';

import {
  showSelectImagesModal,
  hideSelectImagesModal,
  selectCollectionSource,
  SEARCH,
  MY_COLLECTIONS
} from 'state/selectImagesModal';

import {
  toggleImage,
  toggleImageList
} from 'state/selectedImages';

import {
  loadSearchResults,
  inputSearchQuery
} from 'state/search';

import styles from './InputData.scss';

class InputData extends React.Component {
  static propTypes = {
    search: PropTypes.object,
    selectImagesModal: PropTypes.object,
    selectedImages: PropTypes.object,
    selectedCollection: PropTypes.object,
    inputSource: PropTypes.string,
    dispatch: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);

    (this:any).handleSelectSourceClick = this.handleSelectSourceClick.bind(this);
    (this:any).handleCollectionClick = this.handleCollectionClick.bind(this);
    (this:any).handleImageToggle = this.handleImageToggle.bind(this);
    (this:any).handleImageListToggle = this.handleImageListToggle.bind(this);
    (this:any).handleHide = this.handleHide.bind(this);
  }

  componentDidMount() {
    if (!this.props.search.results) {
      this.props.dispatch(loadSearchResults(inputSearchQuery('')));
    }
  }

  handleSelectSourceClick(source) {
    this.props.dispatch(selectCollectionSource(source));
  }

  handleImageToggle(collectionId, imageId) {
    this.props.dispatch(toggleImage({collectionId, imageId}));
    this.props.dispatch(resetImagesMetadata());
  }

  handleImageListToggle(collection, images, checked) {
    this.props.dispatch(toggleImageList({collection, images, checked}));
    this.props.dispatch(resetImagesMetadata());
  }

  handleHide() {
    this.props.dispatch(hideSelectImagesModal());
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

  handleCollectionClick(id, source) {
    this.props.dispatch(showSelectImagesModal({ collectionId: id, source }));
  }

  render() {
    const { selectImagesModal, selectedImages, inputSource } = this.props;
    const anySelected = this.countSelectedImages(selectedImages.images) === 0;

    return (
      <div className={styles.root}>
        <h1 className="page-header">Input Data</h1>
        <ButtonToolbar style={{marginBottom: 15}}>
          <ButtonGroup bsSize="small" >
            <Button
              active={inputSource === SEARCH}
              onClick={() => this.handleSelectSourceClick(SEARCH)}
            >
              All Collections
            </Button>
            <Button
              active={inputSource === MY_COLLECTIONS}
              onClick={() => this.handleSelectSourceClick(MY_COLLECTIONS)}
            >
              My Collections
            </Button>
          </ButtonGroup>
        </ButtonToolbar>

        <p className="lead">
          {inputSource === MY_COLLECTIONS
            ? 'Select images from one or many of your collections to create a training dataset.'
            : 'Search NeuroVault collections and select images to create a training dataset.'
          }
        </p>

        <div className="row">
          <div className="col-md-9">
            {inputSource === MY_COLLECTIONS
             ? <MyCollectionsContainer
               dispatch={this.props.dispatch}
               onCollectionClick={this.handleCollectionClick}
               />
             : <SearchContainer
               {...this.props.search}
               dispatch={this.props.dispatch}
               onSearchResultClick={this.handleCollectionClick}
               />
            }
          </div>

          <div className="col-md-3">
            <div className="panel panel-default">
              <div className="panel-heading">
                <h3 className="panel-title">Selected Images</h3>
              </div>
              <div className={classNames('panel-body', anySelected && 'empty-dataset')}>
                {anySelected
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
            onToggle={this.handleImageToggle}
            onToggleList={this.handleImageListToggle}
            collection={this.props.selectedCollection}
            onHide={this.handleHide}
          >
            <Link
              disabled={anySelected}
              className="btn btn-primary continue-button"
              to="/models/new/training-label">Continue to Training Label</Link>
          </SelectImagesModal>
        }
      </div>
    );
  }
}

const getSelectedCollection = (state) => {
  const {
    selectImagesModal: { collectionId, source },
    search: { results: searchResults },
    selectedImages: { collectionsById }
  } = state;

  if (!collectionId) {
    return null;
  }

  const myCollectionList = state.fetched['myCollectionList'];

  // Search in stored (already selected) collections
  let collection = collectionsById[collectionId];

  if (collection) {
    return collection;
  }

  // If the collection is not storead already,
  // try to find it in a `source`

  switch (source) {
    case 'SEARCH':
      if (!searchResults) {
        throw new Error('Source is empty');
      }

      collection = searchResults.hits.hits.filter(function (item) {
        return item._id === collectionId;
      })[0];

      return collection._source;

    case 'MY_COLLECTIONS':
      if (isEmpty(myCollectionList)) {
        throw new Error('Source is empty');
      }

      collection = myCollectionList.filter(function (item) {
        return item.id === collectionId;
      })[0];

      return collection;
    default:
      throw new Error('Undefined source');
  }
};

const mapStateToProps = (state) => {
  return {
    search: state.search,
    selectImagesModal: state.selectImagesModal,
    selectedImages: state.selectedImages,
    selectedCollection: getSelectedCollection(state),
    inputSource: state.selectImagesModal.source
  };
};

export default connect(mapStateToProps)(InputData);
