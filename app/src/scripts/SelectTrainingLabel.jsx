'use strict';

import React from 'react';
import Papa from 'papaparse';
import FilePicker from './FilePicker';
import DataGrid from './DataGrid';

export default class SelectTrainingLabel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imagesMetadata: null
    };
  }

  handleFileLoad(file) {
    Papa.parse(file, {
      complete: result => this.setState({
        imagesMetadata: result.data
      })
    });
  }

  render() {
    return (
      <div className="selectTrainingLabel">
        <p>Select filenames and training labels. Right click a corresponding column for each.</p>
        <FilePicker onLoad={this.handleFileLoad.bind(this)}/>
        <br/>
        {this.state.imagesMetadata &&
          <DataGrid data={this.state.imagesMetadata} />
        }
      </div>
    );
  }
}
