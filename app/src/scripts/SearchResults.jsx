'use strict';

import React from 'react';
import SearchResult from './SearchResult';

export default class SearchResults extends React.Component {

  render() {
    var { results } = this.props;
    return results ? (
      <div className="row" style={{border: '1px solid gray'}}>
        SearchResults
        {results.hits.hits.map(hit => <SearchResult hit={hit} />)}
      </div>
    ) : (
      <div className="row" style={{border: '1px solid gray'}}>
        <p>No results found</p>
      </div>
    );
  }
}
