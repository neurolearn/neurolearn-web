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
      finishedJobId: null
    };
  }

  poll(jobid) {
      var _this = this;
      console.log('polling', jobid);

      request.get('/analysis-status')
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
          } else {
            alert('Error while polling result' + res.text);
          }
          setTimeout(() => _this.poll(jobid), 2000.0);
        });
  }

  requestResult(jobid) {
    // upon completion
    this.setState({loaded: true, finishedJobId: jobid});
  }

  handleRunAnalysis(algorithm) {
    var path = `/analysis/${algorithm}`,
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

    this.setState({loaded: false});

    request.post(path)
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
          onRunAnalysis={this.handleRunAnalysis.bind(this)}
        />
        <br />
        <Loader loaded={this.state.loaded} className="spinner">
          {this.state.finishedJobId &&
            <WeightMap jobid={this.state.finishedJobId} />
          }
        </Loader>

      </div>
    );
  }
}
