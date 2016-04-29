import React, { PropTypes } from 'react';
import SearchResult from './SearchResult';

import styles from './SearchResults.scss';

export default class SearchResults extends React.Component {
  static propTypes = {
    results: PropTypes.object,
    onSearchResultClick: PropTypes.func.isRequired
  }

  render() {
    var { results } = this.props;
    return results.hits.total ? (
      <div className={styles.root}>
        {results.hits.hits.map(hit =>
          <SearchResult key={hit._id}
                        hit={hit}
                        onClick={() => this.props.onSearchResultClick(hit._id)} />)}
      </div>
    ) : (
      <div className={styles.root}>
        <h3>No collections found</h3>
      </div>
    );
  }
}
