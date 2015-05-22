'use strict';

import React from 'react';
import SelectCollection from './SelectCollection';
import CollectionInfo from './CollectionInfo';
import SelectTrainingLabel from './SelectTrainingLabel';
import RunAnalysisForm from './RunAnalysisForm';
import WeightMap from './WeightMap';
import request from 'superagent';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collection: null
    };
  }

  handleRunAnalysis(algorithm) {
    var path = `http://localhost:3000/analysis/${algorithm}`,
        _this = this;

    console.log(path);

    // sending [{filename -> label}]
    // this should return ticketID
    // run task in celery
    // return a job.id
    var payload = {
      data: [
        {filename: 'Pain_Subject_6_Image_Low.nii.gz', target: 1},
        {filename: 'Pain_Subject_7_Image_Medium.nii.gz', target: 2},
        {filename: 'Pain_Subject_8_Image_Low.nii.gz', target: 1}
      ]
    };

    request.post(path)
      .type('json')
      .accept('json')
      .send(payload)
      .end(function(err, res) {
        if (res.ok) {

        } else {
          alert('Error while fetching result' + res.text);
        }
      });
  }

  handleUserInput(collectionId) {
    var path = `http://localhost:3000/nvproxy/api/collections/${collectionId}`,
        _this = this;

    request.get(path)
      .end(function(err, res) {
        if (res.ok) {
          _this.setState({
            collection: res.body
          });
        } else {
          alert('Error while fetching collection' + res.text);
        }
      });
  }

  render() {
    var collectionInfo = '';

    if (this.state.collection) {
      collectionInfo = <CollectionInfo collection={this.state.collection} />;
    }

    return (
      <div className = "app">
        <h1>Neurolearn</h1>
        <SelectCollection
          onUserInput={this.handleUserInput.bind(this)}
        />
        {collectionInfo}
        <SelectTrainingLabel />
        <br />
        <RunAnalysisForm
          onRunAnalysis={this.handleRunAnalysis}
        />
        <br />
        <WeightMap />
      </div>
    );
  }
}
