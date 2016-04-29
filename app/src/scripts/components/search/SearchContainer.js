import isEmpty from 'lodash/lang/isEmpty';
import React, { PropTypes } from 'react';
import SearchInput from './SearchInput';
import SortSearchResults from './SortSearchResults';
import SearchResults from './SearchResults';
import SearchPagination from './Pagination';
import RefineSearchResults from './RefineSearchResults';
import { RESULTS_PER_PAGE } from '../../constants/Search';

import {
  loadSearchResults,
  inputSearchQuery,
  selectSearchOffset,
  selectSortType,
  changeFilter,
} from '../../state/search';


import styles from './SearchContainer.scss';

function totalPages(totalResults, resultsPerPage) {
  return Math.ceil(totalResults / resultsPerPage);
}

function activePage(searchFrom, resultsPerPage) {
  return Math.ceil(searchFrom / resultsPerPage) + 1;
}

export default class SearchContainer extends React.Component {
  static propTypes = {
    isFetching: PropTypes.bool,
    query: PropTypes.string,
    filter: PropTypes.object,
    results: PropTypes.object,
    from: PropTypes.number,
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
    const { isFetching, results, filter, query, sort } = this.props;

    return (
      <div className={styles.root}>
        <div className="row">
          <div className="col-md-3">
            <RefineSearchResults
              results={results}
              filter={filter}
              onChange={this.handleFilterChange.bind(this)}
            />
          </div>

          <div className="col-md-9">
            <div className="panel panel-default">
              <div className="panel-body">
                <SearchInput
                  value={query}
                  placeholder="Search NeuroVault Collections"
                  onChange={this.handleSearchInputChange.bind(this)}
                />
                <div className="search-meta clearfix">
                  <div className="pull-left HitsCount">Found {this.totalHits(results)} collections</div>
                  <div className="pull-right">
                    <SortSearchResults
                      sortType={sort}
                      onSelect={this.handleSortSelect.bind(this)}
                    />
                  </div>
                </div>
                <div className="search-results-wrapper">
                  {results &&
                  <SearchResults
                    results={results}
                    onSearchResultClick={this.props.onSearchResultClick}
                  />}
                  {isFetching && <div className="overlay"></div>}
                </div>
                { this.totalHits(results) > RESULTS_PER_PAGE
                  ? <SearchPagination
                      totalPages={totalPages(this.totalHits(results), RESULTS_PER_PAGE)}
                      activePage={activePage(this.props.from, RESULTS_PER_PAGE)}
                      onSelect={this.handlePageSelect.bind(this)} />
                  : false }
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
