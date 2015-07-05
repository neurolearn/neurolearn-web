'use strict';

import React from 'react';
import request from 'superagent';
import SelectCollection from './SelectCollection';
import CollectionInfo from './CollectionInfo';
import SelectTrainingLabel from './SelectTrainingLabel';
import RunAnalysisForm from './RunAnalysisForm';
import Results from './Results';
import Loader from 'react-loader';
import DataGrid from './DataGrid';


export default class TrainModel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collection: null,
      collectionId: null,
      loaded: true,
      finishedJobId: null,
      algorithm: null,
      targetData: null,
      testData:  [
                  ['=$B$2', "Maserati", "Mazda", "Mercedes", "Mini", "=A$1"],
                  [2009, 0, 2941, 4303, 354, 5814],
                  [2010, 5, 2905, 2867, '=SUM(A4,2,3)', '=$B1'],
                  [2011, 4, 2517, 4822, 552, 6127],
                  [2012, '=SUM(A2:A5)', '=SUM(B5,E3)', '=A2/B2', 12, 4151]
                ]
    };

    if (false) {
      this.state.finishedJobId = '90889587-3dad-45cb-a642-39b1c655462f';
      this.state.algorithm = 'ridge';
    }
  }

  poll(jobid) {
      var _this = this;
      console.log('polling', jobid);

      request.get('/status')
        .type('json')
        .accept('json')
        .query({ jobid: jobid })
        .end(function(err, res) {
          if(res.ok) {
            console.log(res.body);
            if (res.body.state === 'SUCCESS') {
              _this.requestResult(jobid);
              return;
            }
            if (res.body.state === 'FAILURE') {
              var msg = 'Failed to process the analysis.\n';
              if (res.body.message) {
                msg += res.body.message;
              } else {
                msg += 'Please contact the developer.';
              }
              window.alert(msg);
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

    this.setState({finishedJobId: null,
                   algorithm: algorithm});

    var payload = {
      'data': this.targetData,
      'collection_id': this.state.collectionId,
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
            collection: res.body,
            collectionId: collectionId
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
      collectionInfo = <CollectionInfo collectionId={this.state.collectionId} collection={this.state.collection} />;
    }

    return (
      <div className = "TrainModel">
        <p>1. Select a NeuroVault collection. <em>For example, 504.</em></p>
          <DataGrid data={this.state.testData} />

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
            <Results jobid={this.state.finishedJobId}
                     algorithm={this.state.algorithm} />
          }
        </Loader>
      </div>
    );
  }
}
