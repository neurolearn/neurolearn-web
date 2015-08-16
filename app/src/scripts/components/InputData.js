import request from 'superagent';
import debounce from 'lodash/function/debounce';

import React, { PropTypes } from 'react';
import update from 'react/lib/update';
import { connect } from 'react-redux';
import classNames from 'classnames';
import SearchContainer from '../components/SearchContainer';
import SelectImagesModal from '../components/SelectImagesModal';
import SelectedCollectionList from '../components/SelectedCollectionList';
import SearchSortTypes from '../constants/SearchSortTypes';
import { RESULTS_PER_PAGE, DEFAULT_SEARCH_SORT } from '../constants/Search';
import { showSelectImagesModal,
         hideSelectImagesModal,
         toggleImage,
         toggleAllImages } from '../actions';

import styles from './InputData.scss';

function sortOption(sortType) {
  return SearchSortTypes[sortType].option;
}

class InputData extends React.Component {
  static propTypes = {
    selectImagesModal: PropTypes.object,
    dispatch: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      searchResults: null,
      searchQuery: '',
      searchFilter: null,
      searchFrom: 0,
      searchSort: DEFAULT_SEARCH_SORT
    };

    this.collectionStore = {};
  }

  loadSearchResults() {
    const _this = this;

    const query = this.state.searchQuery
      ? {
        'multi_match': {
          'type': 'phrase_prefix',
          'query': this.state.searchQuery,
          'max_expansions': 50,
          'slop': 10,
          'fields': ['name', 'authors']
        }
      }
      : undefined;

    const filter = this.state.searchFilter
      ? this.state.searchFilter
      : undefined;

    const aggs = {
      'number_of_images_stats': {
        'stats': {
          'field': 'number_of_images'
        }
      },
      'handedness': {
        'terms': {
            'field': 'handedness'
        }
      },
      'nested_aggs': {
        'nested': {
          'path': 'images'
        },
        'aggs': {
          'modality': {
            'terms': {
              'field': 'images.modality'
            }
          },
          'map_type': {
            'terms': {
              'field': 'images.map_type'
            }
          }
        }
      }
    };

    request.post('/search')
      .send({
        query: {
          filtered: {
            query: query,
            filter: filter
          }
        },
        size: RESULTS_PER_PAGE,
        from: _this.state.searchFrom,
        sort: sortOption(_this.state.searchSort),
        aggs: aggs
      })
      .type('json')
      .accept('json')
      .end(function(err, res) {
        console.log(res.body);
        this.setState({searchResults: res.body});
      }.bind(this));
  }

  componentDidMount() {
    this.debouncedLoadSearchResults = debounce(this.loadSearchResults, 300);
    this.loadSearchResults();
  }

  handleSearchInputChange(newValue) {
    this.setState({
      searchQuery: newValue,
      searchFrom: 0
    });
    this.debouncedLoadSearchResults();
  }

  handlePageSelect(page) {
    if (page < 1) {
      return;
    }
    this.setState({
      searchFrom: (page - 1) * RESULTS_PER_PAGE
    });
    this.debouncedLoadSearchResults();
  }

  handleSortSelect(sortType) {
    this.setState({
      searchSort: sortType,
      searchFrom: 0
    });
    this.debouncedLoadSearchResults();
  }

  handleFilterChange(value) {
    const toState = function() {
      return {
        'range': {
          'number_of_images': {
            'gte': parseInt(value[0]),
            'lte': parseInt(value[1])
          }
        }
      };
    };

    this.setState({
      searchFilter: toState()
    });

    this.debouncedLoadSearchResults();
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
                <SearchContainer {...this.state}
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
