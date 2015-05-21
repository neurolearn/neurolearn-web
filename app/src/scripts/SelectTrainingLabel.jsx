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
        <p>Select training label</p>
        <FilePicker onLoad={this.handleFileLoad.bind(this)}/>

        <DataGrid data={this.state.imagesMetadata} />

      </div>
    );
  }
}
