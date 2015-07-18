'use strict';

import request from 'superagent';

import React from 'react';
import SearchInput from './SearchInput';
import SortSearchResults from './SortSearchResults';
import SearchResults from './SearchResults';
import Pagination from './Pagination';
import RefineSearchResults from './RefineSearchResults';

import styles from './SearchContainer.scss';

export default class SearchContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: null
    };
  }

  loadSearchResults() {
    request.post('/search')
      .send({
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
    this.loadSearchResults();
  }

  render() {
    return (
      <div className={styles.root}>
        <div className="row">
          <div className="col-md-9">
            <SearchInput />
            <div className="search-meta clearfix">
              <div className="pull-left HitsCount">Found 0 collections</div>
              <div className="pull-right">
                <SortSearchResults/>
              </div>
            </div>
            <SearchResults results={this.state.searchResults} />
            <Pagination />
          </div>
          <div className="col-md-3">
            <RefineSearchResults />
          </div>
        </div>
      </div>
    );
  }
}
