import React from 'react';
import SearchContainer from '../components/SearchContainer';

export default class InputData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false
    };
  }

  render() {
    return (
      <div>
        <h1 className="page-header">Input Data</h1>
        <p className="lead">Search NeuroVault collections and select images to create a training dataset.</p>

        <div className="row">
          <div className="col-md-9">
            <div className="panel panel-default">
              <div className="panel-body">
                <SearchContainer />
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="panel panel-default">
              <div className="panel-heading">
                <h3 className="panel-title">Selected Images</h3>
              </div>
              <div className="panel-body">
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
