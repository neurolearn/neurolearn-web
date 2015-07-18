'use strict';

import React from 'react';
import SearchResult from './SearchResult';

import styles from './SearchResults.scss';

export default class SearchResults extends React.Component {

  render() {
    var { results } = this.props;
    return results ? (
      <div className={styles.root}>
        {results.hits.hits.map(hit => <SearchResult hit={hit} />)}
      </div>
    ) : (
      <div className={styles.root}>
        <h3>No collections found</h3>
      </div>
    );
  }
}
