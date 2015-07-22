import isEmpty from 'lodash/lang/isEmpty';

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
    const { results } = this.props;

    const imagesStats = results
      ? results.aggregations.number_of_images_stats :
      {max: 0, min: 0};

    const handedness = results
      ? results.aggregations.handedness.buckets :
      [];

    const mapType = results
      ? results.aggregations.nested_aggs.map_type.buckets :
      [];

    const modality = results
      ? results.aggregations.nested_aggs.modality.buckets :
      [];

    return (
      <div className="panel panel-default">
        <div className="panel-body">
          <RangeFilter
            label="Number of images"
            value={[imagesStats.min, imagesStats.max]}
            onChange={this.props.onChange} />

          { !isEmpty(handedness)
            ? <TermsFilter
              label="Handedness"
              terms={handedness} />
            : false
          }

          { !isEmpty(mapType)
            ? <TermsFilter
              label="Map Type"
              disabled={true}
              terms={mapType} />
            : false
          }

          { !isEmpty(modality)
            ? <TermsFilter
              label="Modality"
              disabled={true}
              terms={modality} />
            : false
          }
        </div>
      </div>
    );
  }
}

