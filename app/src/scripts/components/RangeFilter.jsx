import React from 'react';

export default class RefineSearchResults extends React.Component {
  renderBuckets(buckets) {
    return buckets.map(bucket => <div>{bucket.key}: {bucket.doc_count}</div>);
  }

  render() {

    return (
      <div>
        Range Filter
      </div>
    );
  }
}

