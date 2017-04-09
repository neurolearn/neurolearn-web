/* @flow */

import React, { PropTypes } from 'react';
import SearchResult from './SearchResult';

import styles from './ResultList.scss';

const SearchResults = (
  { results, onSearchResultClick }
: { results: Object, onSearchResultClick: (id: number) => void }
) => {
  return results.hits.total ? (
    <div className={styles.root}>
      {results.hits.hits.map(hit =>
        <SearchResult
          key={hit._id}
          source={hit._source}
          onClick={() => onSearchResultClick(hit._id, 'SEARCH')}
        />)}
    </div>
  ) : (
    <div className={styles.root}>
      <h3>No collections found</h3>
    </div>
  );
};

SearchResults.propTypes = {
  results: PropTypes.object,
  onSearchResultClick: PropTypes.func.isRequired
};

export default SearchResults;
