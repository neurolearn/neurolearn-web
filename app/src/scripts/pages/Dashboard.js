import { values, isEmpty } from 'lodash';
import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { loadMLModels } from '../state/mlModels';
import { connect } from 'react-redux';

import styles from './Dashboard.scss';

export default class Dashboard extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    mlModels: PropTypes.object
  };

  componentDidMount() {
    this.props.dispatch(loadMLModels());
  }

  renderMLModels(mlModels) {
    const models = values(mlModels);
    return models.map(model =>
      <div className="row mlmodel-row">
        <div className="col-md-9">
          <Link to={`/model/${model.id}`}>{model.name}</Link>
        </div>
        <div className="col-md-3">
          <span className="datetime">{model.created}</span>
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
        <h1 className="page-header">Dashboard</h1>
        <div className="row">
          <div className="col-md-3">
            <Link className="btn btn-primary btn-block" to="/train-model">Train Model</Link>
          </div>
          <div className="col-md-9">
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
