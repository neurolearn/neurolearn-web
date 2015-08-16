import React, { PropTypes } from 'react';
import SearchInput from './SearchInput';
import SortSearchResults from './SortSearchResults';
import SearchResults from './SearchResults';
import SearchPagination from './Pagination';
import RefineSearchResults from './RefineSearchResults';
import { RESULTS_PER_PAGE } from '../constants/Search';

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
    results: PropTypes.object,
    sort: PropTypes.string,
    onSearchResultClick: PropTypes.func.isRequired,
    onFilterChange: PropTypes.func.isRequired,
    onSearchInputChange: PropTypes.func.isRequired,
    onSortSelect: PropTypes.func.isRequired,
    onPageSelect: PropTypes.func.isRequired
  }

  totalHits(searchResults) {
    return searchResults ? searchResults.hits.total : 0;
  }

  render() {
    return (
      <div className={styles.root}>
        <div className="row">
          <div className="col-md-3">
            <RefineSearchResults results={this.props.results}
                                 onChange={this.props.onFilterChange} />
          </div>

          <div className="col-md-9">
            <SearchInput value={this.props.query}
                         onChange={this.props.onSearchInputChange} />
            <div className="search-meta clearfix">
              <div className="pull-left HitsCount">Found {this.totalHits(this.props.results)} collections</div>
              <div className="pull-right">
                <SortSearchResults sortType={this.props.sort}
                                   onSelect={this.props.onSortSelect} />
              </div>
            </div>
            <SearchResults results={this.props.results}
                           onSearchResultClick={this.props.onSearchResultClick}/>

            { this.totalHits(this.props.results) > RESULTS_PER_PAGE
              ? <SearchPagination
                  totalPages={totalPages(this.totalHits(this.props.results), RESULTS_PER_PAGE)}
                  activePage={activePage(this.props.from, RESULTS_PER_PAGE)}
                  onSelect={this.props.onPageSelect} />
              : false }
          </div>
        </div>
      </div>
    );
  }
}
