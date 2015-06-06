'use strict';

import React from 'react';
import ProgressBar from './ProgressBar';

export default class TaskStatus extends React.Component {
  render() {
    return (
      <div className="row">
        <div className="row">
          <div className="col-md-2">Download Images</div>
          <div className="col-md-2"><ProgressBar current="30" /></div>
        </div>
        <div className="row">
          <div className="col-md-2">Resample Images</div>
          <div className="col-md-2"><ProgressBar current="30" /></div>
        </div>
        <div className="row">
          <div className="col-md-2">Train Model</div>
          <div className="col-md-2"><ProgressBar current="30" /></div>
        </div>
      </div>
    );
  }
}
