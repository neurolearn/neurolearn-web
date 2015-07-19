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
      skipEmptyLines: true,
      complete: result => this.setState({
        imagesMetadata: result.data
      })
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.imagesMetadata !== this.state.imagesMetadata;
  }

  render() {
    return (
      <div className="selectTrainingLabel">
        <p>2. Upload a CSV file with metadata for this collection. <em>Try using <a href="/static/data/Pain_Trial_Data.csv">example metadata</a> for collection #504</em>.</p>
        <FilePicker onLoad={this.handleFileLoad.bind(this)}/>
        <br/>
        <p>3. Select image filenames and training labels. Right click a corresponding column for each.</p>
        <br/>
        {this.state.imagesMetadata &&
          <DataGrid onSelectTarget={this.props.onSelectTarget} data={this.state.imagesMetadata} />
        }
      </div>
    );
  }
}
