'use strict';

import React from 'react';
import request from 'superagent';
import InputDataPanel from '../components/InputDataPanel';
import TrainingLabelPanel from '../components/TrainingLabelPanel';
import ModelPreferencesPanel from '../components/ModelPreferencesPanel';
import ResultPanel from '../components/ResultPanel';

export default class TrainModel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collection: null,
      collectionId: null,
      finishedJobId: null,
      algorithm: null,
      targetData: null,
      showModal: false
    };
  }

  render() {
    return (
      <div className = "TrainModel">
        <div className="row">

          <div className="col-md-3 left-column">
            <InputDataPanel />
            <TrainingLabelPanel />
            <ModelPreferencesPanel />
          </div>

          <div className="col-md-9">
            <ResultPanel />
          </div>
        </div>
      </div>
    );
  }
}
