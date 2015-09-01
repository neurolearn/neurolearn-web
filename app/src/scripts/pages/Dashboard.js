import { values, sortByOrder, isEmpty } from 'lodash';
import moment from 'moment';

import React, { PropTypes } from 'react';

import { Link } from 'react-router';
import { connect } from 'react-redux';
import Spinner from '../components/Spinner';
import { loadMLModels } from '../state/mlModels';
import styles from './Dashboard.scss';

export default class Dashboard extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    mlModels: PropTypes.object
  };

  componentDidMount() {
    this.props.dispatch(loadMLModels());
  }

  renderState(state) {
    switch (state) {
      case 'queued':
      case 'progress':
        return <Spinner opts={{scale: 0.75}}/>;
      case 'success':
        return <span className="badge" style={{'background-color': 'green'}}>Complete</span>;
      case 'failure':
        return <span className="badge" style={{'background-color': '#DC0000'}}>Failed</span>;
    }
  }

  renderMLModels(mlModels) {
    const models = sortByOrder(values(mlModels), 'created', 'desc');
    return models.map(model =>
      <div className="row mlmodel-row">
        <div className="col-md-1" style={{height: 40}}>
          { this.renderState(model.training_state) }
        </div>
        <div className="col-md-9">
          <Link to={`/model/${model.id}`}>{model.name}</Link>
        </div>
        <div className="col-md-2">
          <span className="datetime">{moment(model.created).fromNow()}</span>
        </div>
      </div>
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
