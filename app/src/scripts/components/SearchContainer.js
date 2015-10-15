import React, { PropTypes } from 'react';
import SearchInput from './SearchInput';
import SortSearchResults from './SortSearchResults';
import SearchResults from './SearchResults';
import SearchPagination from './Pagination';
import RefineSearchResults from './RefineSearchResults';
import { RESULTS_PER_PAGE } from '../constants/Search';

import {
  loadSearchResults,
  inputSearchQuery,
  selectSearchOffset,
  selectSortType,
  changeFilter,
} from '../state/search';


import styles from './SearchContainer.scss';

function totalPages(totalResults, resultsPerPage) {
  return Math.ceil(totalResults / resultsPerPage);
}

function activePage(searchFrom, resultsPerPage) {
  return Math.ceil(searchFrom / resultsPerPage) + 1;
}

export default class SearchContainer extends React.Component {
  static propTypes = {
    query: PropTypes.string,
    filter: PropTypes.object,
    results: PropTypes.object,
    sort: PropTypes.string,
    onSearchResultClick: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired
  }

  handleSearchInputChange(query) {
    this.props.dispatch(loadSearchResults(inputSearchQuery(query)));
  }

  handleSortSelect(sortType) {
    this.props.dispatch(loadSearchResults(selectSortType(sortType)));
  }

  handlePageSelect(page) {
    if (page < 1) {
      return;
    }

    this.props.dispatch(loadSearchResults(selectSearchOffset(
      (page - 1) * RESULTS_PER_PAGE)));
  }

  handleFilterChange(filter) {
    this.props.dispatch(loadSearchResults(changeFilter(filter)));
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
              results={this.props.results}
              filter={this.props.filter}
              onChange={this.handleFilterChange.bind(this)}
            />
          </div>

          <div className="col-md-9">
            <SearchInput
              value={this.props.query}
              onChange={this.handleSearchInputChange.bind(this)}
            />
            <div className="search-meta clearfix">
              <div className="pull-left HitsCount">Found {this.totalHits(this.props.results)} collections</div>
              <div className="pull-right">
                <SortSearchResults
                  sortType={this.props.sort}
                  onSelect={this.handleSortSelect.bind(this)}
                />
              </div>
            </div>
            <SearchResults
              results={this.props.results}
              onSearchResultClick={this.props.onSearchResultClick}
            />

            { this.totalHits(this.props.results) > RESULTS_PER_PAGE
              ? <SearchPagination
                  totalPages={totalPages(this.totalHits(this.props.results), RESULTS_PER_PAGE)}
                  activePage={activePage(this.props.from, RESULTS_PER_PAGE)}
                  onSelect={this.handlePageSelect.bind(this)} />
              : false }
          </div>
        </div>
      </div>
    );
  }
}
