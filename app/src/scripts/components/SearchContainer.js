import request from 'superagent';
import debounce from 'lodash/function/debounce';

import React from 'react';
import SearchInput from './SearchInput';
import SortSearchResults from './SortSearchResults';
import SearchResults from './SearchResults';
import SearchPagination from './Pagination';
import RefineSearchResults from './RefineSearchResults';
import SearchSortTypes from '../constants/SearchSortTypes';


import styles from './SearchContainer.scss';


const RESULTS_PER_PAGE = 5;
const DEFAULT_SEARCH_SORT = 'RECENTLY_UPDATED';


function totalPages(totalResults, resultsPerPage) {
  return Math.ceil(totalResults / resultsPerPage);
}

function activePage(searchFrom, resultsPerPage) {
  return Math.ceil(searchFrom / resultsPerPage) + 1;
}

function sortOption(sortType) {
  return SearchSortTypes[sortType].option;
}

export default class SearchContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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
    console.log('got it', value);
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

  totalHits(searchResults) {
    return searchResults ? searchResults.hits.total : 0;
  }

  render() {
    return (
      <div className={styles.root}>
        <div className="row">
          <div className="col-md-3">
            <RefineSearchResults
              results={this.state.searchResults}
              onChange={this.handleFilterChange.bind(this)} />
          </div>

          <div className="col-md-9">
            <SearchInput value={this.state.searchQuery} onChange={this.handleSearchInputChange.bind(this)} />
            <div className="search-meta clearfix">
              <div className="pull-left HitsCount">Found {this.totalHits(this.state.searchResults)} collections</div>
              <div className="pull-right">
                <SortSearchResults sortType={this.state.searchSort}
                  onSelect={this.handleSortSelect.bind(this)} />
              </div>
            </div>
            <SearchResults results={this.state.searchResults} />

            { this.totalHits(this.state.searchResults) > RESULTS_PER_PAGE
              ? <SearchPagination
                  totalPages={totalPages(this.totalHits(this.state.searchResults), RESULTS_PER_PAGE)}
                  activePage={activePage(this.state.searchFrom, RESULTS_PER_PAGE)}
                  onSelect={this.handlePageSelect.bind(this)} />
              : false }
          </div>
        </div>
      </div>
    );
  }
}
