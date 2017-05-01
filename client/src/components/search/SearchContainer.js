/* @flow */

import React, { PropTypes } from 'react';
import SearchInput from './SearchInput';
import SortSearchResults from './SortSearchResults';
import ResultList from './ResultList';
import Pagination from './Pagination';
import RefineSearchResults from './RefineSearchResults';
import { RESULTS_PER_PAGE } from '../../constants/Search';

import {
  loadSearchResults,
  inputSearchQuery,
  selectSearchOffset,
  selectSortType,
  changeFilter
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
    maxNumberOfImages: PropTypes.number,
    onSearchResultClick: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired
  };

  constructor(props: Object) {
    super(props);

    (this:any).handleFilterChange = this.handleFilterChange.bind(this);
    (this:any).handleSearchInputChange = this.handleSearchInputChange.bind(
      this
    );
    (this:any).handleSortSelect = this.handleSortSelect.bind(this);
    (this:any).handlePageSelect = this.handlePageSelect.bind(this);
  }

  handleSearchInputChange(query: string) {
    this.props.dispatch(loadSearchResults(inputSearchQuery(query)));
  }

  handleSortSelect(sortType: string) {
    this.props.dispatch(loadSearchResults(selectSortType(sortType)));
  }

  handlePageSelect(page: number) {
    if (page < 1) {
      return;
    }

    this.props.dispatch(
      loadSearchResults(selectSearchOffset((page - 1) * RESULTS_PER_PAGE))
    );
  }

  handleFilterChange(filter: Object) {
    this.props.dispatch(loadSearchResults(changeFilter(filter)));
  }

  totalHits(searchResults: Object) {
    return searchResults ? searchResults.hits.total : 0;
  }

  render() {
    const {
      isFetching,
      results,
      maxNumberOfImages,
      filter,
      query,
      sort
    } = this.props;

    return (
      <div className={styles.root}>
        <div className="row">
          <div className="col-md-3">
            <RefineSearchResults
              results={results}
              filter={filter}
              maxNumberOfImages={maxNumberOfImages}
              onChange={this.handleFilterChange}
            />
          </div>

          <div className="col-md-9">
            <div className="panel panel-default">
              <div className="panel-body">
                <SearchInput
                  value={query}
                  placeholder="Search NeuroVault Collections"
                  onChange={this.handleSearchInputChange}
                />
                <div className="search-meta clearfix">
                  <div className="pull-left HitsCount">
                    Found {this.totalHits(results)} collections
                  </div>
                  <div className="pull-right">
                    <SortSearchResults
                      sortType={sort}
                      onSelect={this.handleSortSelect}
                    />
                  </div>
                </div>
                <div className="search-results-wrapper">
                  {results &&
                    <ResultList
                      results={results}
                      onSearchResultClick={this.props.onSearchResultClick}
                    />}
                  {isFetching && <div className="overlay" />}
                </div>
                {this.totalHits(results) > RESULTS_PER_PAGE
                  ? <Pagination
                      totalPages={totalPages(
                        this.totalHits(results),
                        RESULTS_PER_PAGE
                      )}
                      activePage={activePage(this.props.from, RESULTS_PER_PAGE)}
                      onSelect={this.handlePageSelect}
                    />
                  : false}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
