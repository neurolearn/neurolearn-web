'use strict';

import React from 'react';

export default class RefineSearchResults extends React.Component {
  renderBuckets(buckets) {
    return buckets.map(bucket => <div>{bucket.key}: {bucket.doc_count}</div>);
  }

  render() {

    return (
      <div className="panel panel-default">
        <div className="panel-heading">
          <h3 className="panel-title">Refine</h3>
        </div>
        <div className="panel-body">
          <h4>Map Type</h4>
          { this.props.results
              ? this.renderBuckets(this.props.results.aggregations.nested_aggs.map_type.buckets)
              : false
          }
          <h4>Modality</h4>
          { this.props.results
              ? this.renderBuckets(this.props.results.aggregations.nested_aggs.modality.buckets)
              : false
          }

        </div>
      </div>
    );
  }
}

