'use strict';

import React from 'react';

export default class WeightMap extends React.Component {
  render() {
    return (
      <div className="WeightMap">
        <p>Result weight map for {this.props.jobid}</p>
        <img src="http://i.imgur.com/zinUcMm.png"/>
      </div>
    );
  }
}
