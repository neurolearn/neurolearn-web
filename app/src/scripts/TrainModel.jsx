'use strict';

import React from 'react';
import request from 'superagent';
import MyModal from './Modal';
import InputDataPanel from './InputDataPanel';
import TrainingLabelPanel from './TrainingLabelPanel';
import ModelPreferencesPanel from './ModelPreferencesPanel';
import ResultPanel from './ResultPanel';

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

  requestResult(jobid) {
    this.setState({loaded: true, finishedJobId: jobid});
  }

  handleUserInput(collectionId) {
    var path = `/nvproxy/api/collections/${collectionId}`,
        _this = this;

    request.get(path)
      .end(function(err, res) {
        if (res.ok) {
          _this.setState({
            collection: res.body,
            collectionId: collectionId
          });
        } else {
          alert('Error while fetching collection' + res.text);
        }
      });
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

        <MyModal show={this.state.showModal} onHide={()=>this.setState({showModal: false})}/>
      </div>
    );
  }
}
