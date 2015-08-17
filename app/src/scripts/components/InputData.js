import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import SearchContainer from '../components/SearchContainer';
import SelectImagesModal from '../components/SelectImagesModal';
import SelectedCollectionList from '../components/SelectedCollectionList';
import { RESULTS_PER_PAGE } from '../constants/Search';
import { Link } from 'react-router';

import {
  showSelectImagesModal,
  hideSelectImagesModal,
  toggleImage,
  toggleAllImages,
  loadSearchResults,
  inputSearchQuery,
  selectSearchOffset,
  selectSortType,
  changeFilter
} from '../actions';

import styles from './InputData.scss';

class InputData extends React.Component {
  static propTypes = {
    search: PropTypes.object,
    selectImagesModal: PropTypes.object,
    selectedImages: PropTypes.object,
    dispatch: PropTypes.func.isRequired
  };

  componentDidMount() {
    if (!this.props.search.results) {
      this.props.dispatch(loadSearchResults(inputSearchQuery('')));
    }
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

  handleImageToggle(collection, imageId) {
    this.props.dispatch(toggleImage(collection, imageId));
  }

  handleToggleAll(collection, checked) {
    this.props.dispatch(toggleAllImages(collection, checked));
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
                  : <SelectedCollectionList selectedImages={selectedImages}
                               onItemClick={(id) => this.handleCollectionClick(id)} />
                }
                <Link disabled={anySelected} className="btn btn-primary btn-block continue-button" to="/train-model/training-label">Continue to Training Label</Link>
              </div>
            </div>
          </div>
        </div>
        {selectImagesModal.collectionId &&
          <SelectImagesModal
            show={selectImagesModal.display}
            onToggle={(collection, imageId) =>
                        this.handleImageToggle(collection, imageId)}
            onToggleAll={(collection, checked) =>
                        this.handleToggleAll(collection, checked)}
            collection={this.getCollection(selectImagesModal.collectionId,
                                           selectedImages.collectionsById)}
            selectedImages={this.getSelectedImagesInCollection(selectedImages.images,
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
