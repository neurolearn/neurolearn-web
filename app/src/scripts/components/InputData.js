import request from 'superagent';
import debounce from 'lodash/function/debounce';

import React from 'react';
import update from 'react/lib/update';
import SearchContainer from '../components/SearchContainer';
import SelectImagesModal from '../components/SelectImagesModal';
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

  handleToggleAll(collectionId) {

  }

  getCollection(searchResults, collectionId) {
    if (!searchResults) {
      return null;
    }
    return searchResults.hits.hits.filter(function (item) {
      return item._id === collectionId;
    })[0];
  }

  getSelectedImages(selectedImages, collectionId) {
    return selectedImages[collectionId];
  }

  render() {
    console.log(this.state.search);
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
                                 onSearchResultClick={id => this.setState({showModal: true, collectionId: id})} />
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="panel panel-default">
              <div className="panel-heading">
                <h3 className="panel-title">Selected Images</h3>
              </div>
              <div className="panel-body empty-dataset">
                <p>Training dataset is empty.</p>
              </div>
            </div>
          </div>
        </div>
        <SelectImagesModal
          show={this.state.showModal}
          onToggle={(collectionId, imageId) =>
                      this.handleImageToggle(collectionId, imageId)}
          onToggleAll={(collectionId) =>
                      this.handleToggleAll(collectionId)}
          collection={this.getCollection(this.state.searchResults,
                                         this.state.collectionId)}
          selectedImages={this.getSelectedImages(this.state.selectedImages,
                                                 this.state.collectionId)}
          onHide={()=>this.setState({showModal: false})} />
      </div>
    );
  }
}
