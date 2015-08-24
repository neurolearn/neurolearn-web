import React from 'react';
import { Link } from 'react-router';

export default class Dashboard extends React.Component {
  componentDidMount() {

  }

  render() {
    return (
      <div>
        <h1 className="page-header">Dashboard</h1>
        <div className="row">
          <div className="col-md-3">
            <Link className="btn btn-primary btn-block" to="/train-model">Train Model</Link>
          </div>
          <div className="col-md-9">
            <Link to="/model/42">
            <h3>Changing value through cued approach: an automatic mechanism of behavior change</h3>
            </Link>
          </div>
        </div>
      </div>
    );
  }
}
