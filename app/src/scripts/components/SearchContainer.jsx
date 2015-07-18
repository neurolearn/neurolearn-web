'use strict';

import request from 'superagent';
import { debounce } from 'lodash';

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
    request.post('/search')
      .send({
        query: {
          'multi_match': {
            query: this.state.searchQuery,
            fields: ['name', 'authors']
          }
        },
        size: 5,
        sort: { 'modify_date': { 'order': 'desc'}}
      })
      .type('json')
      .accept('json')
      .end(function(err, res) {
        console.log(res);
        this.setState({searchResults: res.body});
      }.bind(this));
  }

  componentDidMount() {
    this.debouncedLoadSearchResults = debounce(this.loadSearchResults, 700);
    this.loadSearchResults();
  }

  handleSearchInputChange(newValue) {
    this.setState({
      searchQuery: newValue
    });
    this.debouncedLoadSearchResults();
  }

  render() {
    return (
      <div className={styles.root}>
        <div className="row">
          <div className="col-md-9">
            <SearchInput value={this.state.searchQuery} onChange={this.handleSearchInputChange.bind(this)} />
            <div className="search-meta clearfix">
              <div className="pull-left HitsCount">Found 0 collections</div>
              <div className="pull-right">
                <SortSearchResults/>
              </div>
            </div>
            <SearchResults results={this.state.searchResults} />
            <SearchPagination />
          </div>
          <div className="col-md-3">
            <RefineSearchResults />
          </div>
        </div>
      </div>
    );
  }
}
