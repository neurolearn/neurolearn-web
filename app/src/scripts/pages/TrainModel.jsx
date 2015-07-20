import React from 'react';
import InputDataPanel from '../components/InputDataPanel';
import TrainingLabelPanel from '../components/TrainingLabelPanel';
import ModelPreferencesPanel from '../components/ModelPreferencesPanel';
import ResultPanel from '../components/ResultPanel';
import SearchContainer from '../components/SearchContainer';

export default class TrainModel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collection: null,
      collectionId: null,
      finishedJobId: null,
      algorithm: null,
      targetData: null,
      showModal: false
    };
  }

  render() {
    return (
      <div className = "TrainModel">

        <ul className="nav nav-wizard">
          <li className="active"><a href="#">Input Data</a></li>
          <li><a href="#">Training Label</a></li>
          <li><a href="#">Model Preferences</a></li>
          <li><a href="#">Review</a></li>
        </ul>

        <h1 className="page-header">Input Data</h1>
        <p className="lead">Search NeuroVault's collections and select images to create a training dataset.</p>

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
