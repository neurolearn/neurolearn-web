'use strict';

import React from 'react';
import TrainModel from './pages/TrainModel';
import TestPatternMap from './pages/TestPatternMap';

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
