import { pluck, round } from 'lodash';
import d3 from 'd3';
import React, { PropTypes } from 'react';
import ReactD3 from 'react-d3-components';

import styles from './ScatterPlot.scss';

function getPadding(extent) {
  return (extent[1] - extent[0]) / 10;
}

function createScale(extent, padding, range) {
  return d3.scale.linear().domain([extent[0] - padding, extent[1] + padding]).nice().range(range);
}

export default class ScatterPlot extends React.Component {
  static propTypes = {
    data: React.PropTypes.array.isRequired,
    height: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired
  }

  render() {
    const { width } = this.props;

    const xExtent = d3.extent(pluck(this.props.data[0].values, 'x'));
    const xPadding = getPadding(xExtent);
    const xScale = createScale(xExtent, xPadding, [0, width - 40]);

    const tooltipScatter = function(x, y) {
        return 'Predicted: ' + round(y, 2);
    };

    return (
      <div className={styles.root}>
        <ReactD3.ScatterPlot
          xScale={xScale}
          {...this.props}
          tooltipHtml={tooltipScatter}
        />
      </div>
    );
  }
}

