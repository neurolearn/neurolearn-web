import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import SearchContainer from '../components/SearchContainer';
import SelectImagesModal from '../components/SelectImagesModal';
import SelectedCollectionList from '../components/SelectedCollectionList';
import { RESULTS_PER_PAGE } from '../constants/Search';
import { showSelectImagesModal,
         hideSelectImagesModal,
         toggleImage,
         toggleAllImages,
         loadSearchResults,
         inputSearchQuery,
         selectSearchOffset,
         selectSortType,
         changeFilter } from '../actions';

import styles from './InputData.scss';

class InputData extends React.Component {
  static propTypes = {
    search: PropTypes.object,
    selectImagesModal: PropTypes.object,
    dispatch: PropTypes.func.isRequired
  };

  constructor(props) {
    this.collectionStore = {};
  }

  componentDidMount() {
    this.props.dispatch(loadSearchResults(inputSearchQuery('')));
  }

  handleSearchInputChange(query) {
    this.props.dispatch(loadSearchResults(inputSearchQuery(query)));
  }

  handlePageSelect(page) {
    if (page < 1) {
      return;
    }

    this.props.dispatch(loadSearchResults(selectSearchOffset(
      (page - 1) * RESULTS_PER_PAGE)));
  }

  handleSortSelect(sortType) {
    this.props.dispatch(loadSearchResults(selectSortType(sortType)));
  }

  handleFilterChange(value) {
    const filter = {
        'range': {
          'number_of_images': {
            'gte': parseInt(value[0]),
            'lte': parseInt(value[1])
          }
        }
    };

    this.props.dispatch(loadSearchResults(changeFilter(filter)));
  }

  handleImageToggle(collectionId, imageId) {
    this.props.dispatch(toggleImage(collectionId, imageId));
  }

  handleToggleAll(collectionId, checked) {
    const collection = this.getCollection(collectionId);
    const imageList = collection._source.images.map((image) => image.url);
    this.props.dispatch(toggleAllImages(collectionId, imageList, checked));
  }

  getCollection(collectionId) {
    const { searchResults } = this.state;
    var collection;

    if (this.collectionStore[collectionId]) {
      return this.collectionStore[collectionId];
    }

    if (!searchResults) {
      return null;
    }

    collection = searchResults.hits.hits.filter(function (item) {
      return item._id === collectionId;
    })[0];

    this.collectionStore[collectionId] = collection;

    return collection;
  }

  getSelectedImagesInCollection(selectedImages, collectionId) {
    return selectedImages[collectionId];
  }

  getSelectedCollections(selectedImages) {
    const collections = Object.keys(selectedImages).map((collectionId) =>
      this.getCollection(collectionId)
    );

    return collections.filter((collection) =>
      this.countSelectedInCollection(selectedImages[collection._id]) > 0);
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
    const anySelected = this.countSelectedImages(this.props.selectedImages) === 0;
    const { selectImagesModal, dispatch } = this.props;

    return (
      <div className={styles.root}>
        <h1 className="page-header">Input Data</h1>
        <p className="lead">Search NeuroVault collections and select images to create a training dataset.</p>

        <div className="row">
          <div className="col-md-9">
            <div className="panel panel-default">
              <div className="panel-body">
                <SearchContainer {...this.props.search}
                                 onFilterChange={this.handleFilterChange.bind(this)}
                                 onSearchInputChange={this.handleSearchInputChange.bind(this)}
                                 onSortSelect={this.handleSortSelect.bind(this)}
                                 onPageSelect={this.handlePageSelect.bind(this)}
                                 onSearchResultClick={this.handleCollectionClick.bind(this)} />
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="panel panel-default">
              <div className="panel-heading">
                <h3 className="panel-title">Selected Images</h3>
              </div>
              <div className={classNames('panel-body', anySelected && 'empty-dataset')}>
                { anySelected
                  ? <p>Training dataset is empty.</p>
                  : <SelectedCollectionList selectedImages={this.props.selectedImages}
                               onItemClick={(id) => this.handleCollectionClick(id)}
                               selectedCollections={this.getSelectedCollections(this.props.selectedImages)} />
                }
              </div>
            </div>
          </div>
        </div>
        {selectImagesModal.collectionId &&
          <SelectImagesModal
            show={selectImagesModal.display}
            onToggle={(collectionId, imageId) =>
                        this.handleImageToggle(collectionId, imageId)}
            onToggleAll={(collectionId, checked) =>
                        this.handleToggleAll(collectionId, checked)}
            collection={this.getCollection(selectImagesModal.collectionId)}
            selectedImages={this.getSelectedImagesInCollection(this.props.selectedImages,
                                                               selectImagesModal.collectionId)}
            onHide={() => dispatch(hideSelectImagesModal())} />
        }
      </div>
    );
  }
}

function select(state) {
  return state;
}

export default connect(select)(InputData);
