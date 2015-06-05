'use strict';

import React from 'react';
import SelectCollection from './SelectCollection';
import CollectionInfo from './CollectionInfo';
import TestPatternMapResults from './TestPatternMapResults';
import FilePicker from './FilePicker';
import Loader from 'react-loader';
import request from 'superagent';

export default class TestPatternMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collection: null,
      collectionId: null,
      weightMapFile: null,
      loaded: true,
      finishedJobId: null
    };
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

  handleFileLoad(file) {
    console.log(file);
    this.state.weightMapFile = file;
  }

  handleSubmit(e) {
    e.preventDefault();
    var file = this.state.weightMapFile,
        _this = this;

    if (file) {
      this.setState({loaded: false});

      request.post('/applymask')
        .accept('json')
        .field('collection_id', this.state.collectionId)
        .attach(this.state.weightMapFile.name, file)
        .end(function(err, res) {
          if (res.ok) {
            var jobid = res.body.jobid;
            // start polling, display spinner
            _this.poll(jobid);
          } else {
            alert('Error while fetching result ' + res.text);
          }
        });
    }
    else {
      alert('Upload a weight map file.');
    }
  }

  handleResult(jobid) {
    this.setState({loaded: true, finishedJobId: jobid});
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
              _this.handleResult(jobid);
              return;
            }
            if (res.body.state === 'FAILURE') {
              var msg = 'Failed to process the apply mask.\n';
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

  render() {
    var collectionInfo = '';

    if (this.state.collection) {
      collectionInfo = <CollectionInfo collectionId={this.state.collectionId} collection={this.state.collection} />;
    }

    return (
      <div className = "TestPatternMap">
        <p>1. Select a NeuroVault collection. <em>For example, 504.</em></p>
        <SelectCollection
          onUserInput={this.handleUserInput.bind(this)}
        />
        {collectionInfo}
        <p>2. Upload a pattern weight map to test on this collection.</p>
        <FilePicker accept="application/x-gzip" onLoad={this.handleFileLoad.bind(this)}/>
        <br/>
        <form onSubmit={this.handleSubmit.bind(this)}>
          <button type="submit" className="btn btn-primary">Apply Weight Map</button>
        </form>
        <Loader loaded={this.state.loaded} top="80%" left="50%" className="spinner">
        </Loader>

        {this.state.finishedJobId &&
          <TestPatternMapResults jobid={this.state.finishedJobId} />
        }
      </div>
    );
  }
}
