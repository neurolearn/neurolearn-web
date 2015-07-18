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

export default class SearchContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: null,
      searchQuery: ''
    };
  }

  loadSearchResults() {
    console.log('search');

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

        size: 5,
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
            <SearchPagination total/>
          </div>
          <div className="col-md-3">
            <RefineSearchResults />
          </div>
        </div>
      </div>
    );
  }
}
