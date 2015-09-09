import { values, sortByOrder, isEmpty } from 'lodash';
import moment from 'moment';

import React, { PropTypes } from 'react';

import { Link } from 'react-router';
import { connect } from 'react-redux';
import { loadModelTests } from '../state/modelTests';
import styles from './Dashboard.scss';

const POLL_INTERVAL = 2500;

export default class ModelTests extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    modelTests: PropTypes.object
  };

  loadModelTests() {
    this.props.dispatch(loadModelTests());
  }

  componentDidMount() {
    this.loadModelTests();
    this.interval = setInterval(this.loadModelTests.bind(this), POLL_INTERVAL);
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

  renderItems(modelTests) {
    const models = sortByOrder(values(modelTests), 'created', 'desc');
    return (
      <table className="table">
        <thead>
          <tr>
            <th>Status</th>
            <th>Name</th>
            <th>Test Duration</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          {
            models.map(model =>
              <tr>
                <td style={{height: 40}}>
                  { this.renderState(model.state) }
                </td>
                <td>
                  <Link to={`/tests/${model.id}`}>{model.name}</Link>
                </td>
                <td>
                  {model.output_data &&
                   model.output_data.duration &&
                   (Math.floor(model.output_data.duration) + ' sec')}
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
        <h3 style={{'color': 'lightgray'}}>No Model Tests Yet</h3>
      </div>
    );
  }

  render() {
    const { modelTests } = this.props;

    return (
      <div className={styles.root}>
        <div className="page-header">
          <Link className="btn btn-primary btn-lg pull-right" to="/tests/new">Test a Model</Link>
          <h1>Tests</h1>
        </div>
        <div className="row">
          <div className="col-md-12">
            { isEmpty(modelTests)
              ? this.renderEmptyState()
              : this.renderItems(modelTests) }
          </div>
        </div>
      </div>
    );
  }
}

function select(state) {
  return state;
}

export default connect(select)(ModelTests);
