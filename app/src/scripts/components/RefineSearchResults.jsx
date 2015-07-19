import React, { PropTypes } from 'react';
import RangeFilter from './RangeFilter';

export default class RefineSearchResults extends React.Component {
  static propTypes = {
    results: PropTypes.object.isRequired
  }

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
          <h5>Number of images</h5>
          <RangeFilter />

          <h5>Handedness</h5>
          { this.props.results
              ? this.renderBuckets(this.props.results.aggregations.handedness.buckets)
              : false
          }
          <h5>Map Type</h5>
          { this.props.results
              ? this.renderBuckets(this.props.results.aggregations.nested_aggs.map_type.buckets)
              : false
          }
          <h5>Modality</h5>
          { this.props.results
              ? this.renderBuckets(this.props.results.aggregations.nested_aggs.modality.buckets)
              : false
          }
        </div>
      </div>
    );
  }
}

