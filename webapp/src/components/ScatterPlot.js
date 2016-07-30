/* @flow */

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

const ScatterPlot = (props: {width: number, data: Array<{values: Object}>}) => {
  const { width } = props;
  const xExtent = d3.extent(pluck(props.data[0].values, 'x'));
  const xPadding = getPadding(xExtent);
  const xScale = createScale(xExtent, xPadding, [0, width - 40]);

  const tooltipScatter = (x, y) => ('Predicted: ' + round(y, 2));

  return (
    <div className={styles.root}>
      <ReactD3.ScatterPlot
        xScale={xScale}
        {...props}
        tooltipHtml={tooltipScatter}
      />
    </div>
  );
};

ScatterPlot.propTypes = {
  data: React.PropTypes.array.isRequired,
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired
};

export default ScatterPlot;
