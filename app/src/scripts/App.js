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

  handleRunAnalysis() {
    console.log('sending a request to the server');
  }

  handleUserInput(collectionId) {
    var path = `http://localhost:3000/nvproxy/api/collections/${collectionId}`,
        _this = this;

    request.get(path)
      .end(function(err, res) {
        console.log(res.body);
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
        <RunAnalysisForm
          onRunAnalysis={this.handleRunAnalysis}
        />
        <WeightMap />
      </div>
    );
  }
}
