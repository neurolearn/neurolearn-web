import { values, sortByOrder, isEmpty } from 'lodash';
import moment from 'moment';

import React, { PropTypes } from 'react';

import { Link } from 'react-router';
import { connect } from 'react-redux';
import { loadMLModels } from '../state/mlModels';
import styles from './Dashboard.scss';

const POLL_INTERVAL = 2500;

export default class Dashboard extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    mlModels: PropTypes.object
  };

  loadMLModels() {
    this.props.dispatch(loadMLModels());
  }

  componentDidMount() {
    this.loadMLModels();
    this.interval = setInterval(this.loadMLModels.bind(this), POLL_INTERVAL);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  renderState(state) {
    switch (state) {
      case 'queued':
        return <span className="badge" style={{'backgroundColor': 'gray'}}>Queued</span>;
      case 'progress':
        return <span className="badge" style={{'backgroundColor': '#E48110'}}>In Progress…</span>;
      case 'success':
        return <span className="badge" style={{'backgroundColor': 'green'}}>Complete</span>;
      case 'failure':
        return <span className="badge" style={{'backgroundColor': '#DC0000'}}>Failed</span>;
    }
  }

  renderMLModels(mlModels) {
    const models = sortByOrder(values(mlModels), 'created', 'desc');
    return (
      <table className="table">
        <thead>
          <tr>
            <th>Status</th>
            <th>Name</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          {
            models.map(model =>
              <tr>
                <td style={{height: 40}}>
                  { this.renderState(model.training_state) }
                </td>
                <td>
                  <Link to={`/model/${model.id}`}>{model.name}</Link>
                </td>
                <td>
                  <span className="datetime">{moment(model.created).fromNow()}</span>
                </td>
              </tr>)
          }
        </tbody>
      </table>
    );
  }

  renderEmptyState() {
    return (
      <div style={{'text-align': 'center'}}>
        <h3 style={{'color': 'lightgray'}}>No Trained Models Yet</h3>
      </div>
    );
  }

  render() {
    const { mlModels } = this.props;

    return (
      <div className={styles.root}>
        <div className="page-header">
          <Link className="btn btn-primary btn-lg pull-right" to="/train-model">Train Model</Link>
          <h1>Dashboard</h1>
        </div>
        <div className="row">
          <div className="col-md-12">
            { isEmpty(mlModels)
              ? this.renderEmptyState()
              : this.renderMLModels(mlModels) }
          </div>
        </div>
      </div>
    );
  }
}

function select(state) {
  return state;
}

export default connect(select)(Dashboard);
