import d3 from 'd3';
import React, { PropTypes } from 'react';
import ReactD3 from 'react-d3-components';

import styles from './ScatterPlot.scss';

export default class ScatterPlot extends React.Component {
  static propTypes = {
  }

  render() {
    const xScale = d3.scale.linear().domain([0.5, 4]).range([0, 500]);

    const tooltipScatter = function(x, y) {
        return 'x: ' + x + ' y: ' + y;
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

