'use strict';

import React from 'react';
import SelectCollection from './SelectCollection';
import CollectionInfo from './CollectionInfo';
import SelectTrainingLabel from './SelectTrainingLabel';
import RunAnalysisForm from './RunAnalysisForm';
import WeightMap from './WeightMap';
import request from 'superagent';
import Loader from 'react-loader';


export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collection: null,
      loaded: true,
      finishedJobId: null,
      targetData: null
    };
  }

  poll(jobid) {
      var _this = this;
      console.log('polling', jobid);

      request.get('/analysis/status')
        .type('json')
        .accept('json')
        .query({ jobid: jobid })
        .end(function(err, res) {
          if(res.ok) {
            console.log(res.body);
            if (res.body.state == 'SUCCESS') {
              _this.requestResult(jobid);
              return;
            }
            if (res.body.state == 'FAILURE') {
              window.alert('Failed to process the analysis. Please contact the developer.');
              _this.setState({loaded: true});
              return;
            }
          } else {
            alert('Error while polling result' + res.text);
          }
          setTimeout(() => _this.poll(jobid), 2000.0);
        });
  }

  requestResult(jobid) {
    this.setState({loaded: true, finishedJobId: jobid});
  }

  handleRunAnalysis(algorithm) {
    var _this = this;

    if (!this.state.collection) {
        window.alert('Select a NeuroVault collection.');
        return;
    }

    if (!this.targetData) {
        window.alert('Select filenames and training labels.');
        return;
    }

    this.setState({finishedJobId: null});

    var payload = {
      'data': this.targetData,
      'collection_id': this.state.collection.id,
      'algorithm': algorithm
    };

    this.setState({loaded: false});

    request.post('/analysis')
      .type('json')
      .accept('json')
      .send(payload)
      .end(function(err, res) {
        if (res.ok) {
          var jobid = res.body.jobid;
          // start polling, display spinner
          _this.poll(jobid);
        } else {
          alert('Error while fetching result' + res.text);
        }
      });
  }

  handleUserInput(collectionId) {
    var path = `/nvproxy/api/collections/${collectionId}`,
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

  handleTargetSelection(targetData) {
    console.log(targetData);
    this.targetData = targetData;
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
        <SelectTrainingLabel
          onSelectTarget={this.handleTargetSelection.bind(this)}
        />
        <br />
        <RunAnalysisForm
          onRunAnalysis={this.handleRunAnalysis.bind(this)}
        />
        <br />
        <Loader loaded={this.state.loaded} top="80%" left="50%" className="spinner">
          {this.state.finishedJobId &&
            <WeightMap jobid={this.state.finishedJobId} />
          }
        </Loader>
      </div>
    );
  }
}
