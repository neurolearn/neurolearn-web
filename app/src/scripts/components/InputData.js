import request from 'superagent';
import debounce from 'lodash/function/debounce';

import React from 'react';
import update from 'react/lib/update';
import classNames from 'classnames';
import SearchContainer from '../components/SearchContainer';
import SelectImagesModal from '../components/SelectImagesModal';
import ImageList from '../components/ImageList';
import SearchSortTypes from '../constants/SearchSortTypes';
import { RESULTS_PER_PAGE, DEFAULT_SEARCH_SORT } from '../constants/Search';

import styles from './InputData.scss';

function sortOption(sortType) {
  return SearchSortTypes[sortType].option;
}

export default class InputData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      collectionId: null,

      selectedImages: {},

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
    const toggle = function(x) {
      if (x) {
        if (x[imageId]) {
          x[imageId] = false;
        } else {
          x[imageId] = true;
        }
        return x;
      } else {
        return {[imageId]: true};
      }
    };

    let selectedImages = update(this.state.selectedImages,
      {[collectionId]: {$apply: toggle}}
    );

    this.setState({ selectedImages });
  }

  handleToggleAll(collectionId, checked) {
    const collection = this.getCollection(collectionId);
    const imageList = collection._source.images.reduce(function(accum, image) {
      accum[image.url] = checked;
      return accum;
    }, {});

    let selectedImages = update(this.state.selectedImages,
      {[collectionId]: {$set: imageList}}
    );

    this.setState({ selectedImages });
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
    return Object.keys(selectedImages).map((collectionId) =>
      this.getCollection(collectionId)
    );
  }

  countSelectedImages(selectedImages) {
    const countInCollection = function(collection) {
      return collection && Object.keys(collection).reduce((accum, key) =>
        collection[key] ? accum + 1 : accum,
      0);
    };

    return Object.keys(selectedImages).reduce((accum, key) =>
        countInCollection(selectedImages[key]) + accum,
      0);
  }

  render() {
    console.log(this.state.search);
    const anySelected = this.countSelectedImages(this.state.selectedImages) === 0;

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
                                 onSearchResultClick={(id) => this.setState({showModal: true, collectionId: id})} />
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
                  : <ImageList selectedImages={this.state.selectedImages}
                               onItemClick={(id) => this.setState({showModal: true, collectionId: id})}
                               selectedCollections={this.getSelectedCollections(this.state.selectedImages)} />
                }
              </div>
            </div>
          </div>
        </div>
        {this.state.collectionId &&
          <SelectImagesModal
            show={this.state.showModal}
            onToggle={(collectionId, imageId) =>
                        this.handleImageToggle(collectionId, imageId)}
            onToggleAll={(collectionId, checked) =>
                        this.handleToggleAll(collectionId, checked)}
            collection={this.getCollection(this.state.collectionId)}
            selectedImages={this.getSelectedImagesInCollection(this.state.selectedImages,
                                                               this.state.collectionId)}
            onHide={()=>this.setState({showModal: false})} />
        }
      </div>
    );
  }
}
