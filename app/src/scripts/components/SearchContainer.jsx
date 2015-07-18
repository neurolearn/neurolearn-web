'use strict';

import request from 'superagent';
import debounce from 'lodash/function/debounce';

import React from 'react';
import SearchInput from './SearchInput';
import SortSearchResults from './SortSearchResults';
import SearchResults from './SearchResults';
import SearchPagination from './Pagination';
import RefineSearchResults from './RefineSearchResults';

import styles from './SearchContainer.scss';


const RESULTS_PER_PAGE = 5;


function totalPages(totalResults, resultsPerPage) {
  return Math.ceil(totalResults / resultsPerPage);
}

function activePage(searchFrom, resultsPerPage) {
  return Math.ceil(searchFrom / resultsPerPage) + 1;
}

export default class SearchContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: null,
      searchQuery: '',
      searchFrom: 0
    };
  }

  loadSearchResults() {
    console.log('search');

    const _this = this;

    const query = this.state.searchQuery ?
        {
          'multi_match': {
            query: this.state.searchQuery,
            fields: ['name', 'authors']
          }
        } :
        undefined;

    request.post('/search')
      .send({
        query: query,

        size: RESULTS_PER_PAGE,
        from: _this.state.searchFrom,
        sort: { 'modify_date': { 'order': 'desc'}}
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
      searchQuery: newValue
    });
    this.debouncedLoadSearchResults();
  }

  handlePageSelect(page) {
    console.log('changed page to', page);
    if (page < 1) {
      return;
    }
    this.setState({
      searchFrom: (page - 1) * RESULTS_PER_PAGE
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
          <div className="col-md-9">
            <SearchInput value={this.state.searchQuery} onChange={this.handleSearchInputChange.bind(this)} />
            <div className="search-meta clearfix">
              <div className="pull-left HitsCount">Found {this.totalHits(this.state.searchResults)} collections</div>
              <div className="pull-right">
                <SortSearchResults/>
              </div>
            </div>
            <SearchResults results={this.state.searchResults} />
            {this.state.searchResults && this.state.searchResults.hits.total
              ? <SearchPagination
                  totalPages={totalPages(this.totalHits(this.state.searchResults), RESULTS_PER_PAGE)}
                  activePage={activePage(this.state.searchFrom, RESULTS_PER_PAGE)}
                  onSelect={this.handlePageSelect.bind(this)} />
              : false }
          </div>
          <div className="col-md-3">
            <RefineSearchResults />
          </div>
        </div>
      </div>
    );
  }
}
