'use strict';

import React from 'react';
import RunAnalysisForm from './RunAnalysisForm';
import Results from './Results';
import Loader from 'react-loader';

export default class ResultPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: true,
      finishedJobId: null,
      algorithm: null
    };
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

  render() {
    return (
      <div className="panel panel-default">
        <div className="panel-heading">
          <h3 className="panel-title">Result</h3>
        </div>
        <div className="panel-body">
          <button type="submit" className="btn btn-primary">Run Model Training</button>
           <RunAnalysisForm
            onRunAnalysis={this.handleRunAnalysis.bind(this)}
          />
          <Loader loaded={this.state.loaded} top="80%" left="50%" className="spinner">
            {this.state.finishedJobId &&
              <Results jobid={this.state.finishedJobId}
                       algorithm={this.state.algorithm} />
            }
          </Loader>
        </div>
      </div>
    );
  }
}
