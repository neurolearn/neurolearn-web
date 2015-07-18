'use strict';

import React from 'react';
import SearchResult from './SearchResult';

export default class SearchResults extends React.Component {

  render() {
    var { results } = this.props;
    return results ? (
      <div>
        {results.hits.hits.map(hit => <SearchResult hit={hit} />)}
      </div>
    ) : (
      <div>
        <h3>No collections found</h3>
      </div>
    );
  }
}
