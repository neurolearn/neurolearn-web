'use strict';

import React from 'react';
import TrainModel from './TrainModel';
import TestPatternMap from './TestPatternMap';

export default class App extends React.Component {
  render () {
    var Child;
    switch (this.props.route) {
      case 'test-pattern-map': Child = TestPatternMap; break;
      default: Child = TrainModel;
    }

    return (
      <div className="App">
        <Child/>
      </div>
    );
  }
}
