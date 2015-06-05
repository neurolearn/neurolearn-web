'use strict';

import React from 'react';

export default class TestPatternMapResults extends React.Component {
  render() {
    return (
      <div className="TestPatternMapResults">
        <p>Results for test pattern id {this.props.jobid}</p>

        <div className='WeightMapPlot' style={{marginTop: 20}}>
          <img src={'/media/' + this.props.jobid + '/' + 'test_pattern_mask_plot.png'}/>
        </div>
      </div>
    );
  }
}
