import React, { PropTypes } from 'react';
import RangeFilter from './RangeFilter';
import TermsFilter from './TermsFilter';

export default class RefineSearchResults extends React.Component {
  static propTypes = {
    results: PropTypes.object.isRequired,
    onChange: PropTypes.func
  }

  renderBuckets(buckets) {
    return buckets.map(bucket => <div>{bucket.key}: {bucket.doc_count}</div>);
  }

  render() {

    const imagesStats = this.props.results
      ? this.props.results.aggregations.number_of_images_stats :
      {max: 0, min: 0};

    const handedness = this.props.results
      ? this.props.results.aggregations.handedness.buckets :
      []

    return (
      <div className="panel panel-default">
        <div className="panel-heading">
          <h3 className="panel-title">Refine</h3>
        </div>
        <div className="panel-body">
          <RangeFilter
            label="Number of images"
            valuesFrom={imagesStats.min}
            valuesTo={imagesStats.max}
            onChange={this.props.onChange} />

          { handedness
            ? <TermsFilter
              label="Handedness"
              terms={handedness} />
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

