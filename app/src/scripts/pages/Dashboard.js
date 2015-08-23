import React from 'react';
import { Link } from 'react-router';

export default class Dashboard extends React.Component {
  render() {
    return (
      <div>
        <h1 className="page-header">Dashboard</h1>
        <div className="row">
          <div className="col-md-3">
            <Link className="btn btn-primary btn-block" to="/train-model">Train Model</Link>
          </div>
          <div className="col-md-9">

          </div>
        </div>
      </div>
    );
  }
}
