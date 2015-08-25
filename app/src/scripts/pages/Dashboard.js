import { values } from 'lodash';
import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { loadMLModels } from '../state/mlModels';
import { connect } from 'react-redux';

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
      <Link to={`/model/${model.id}`}>
        <h3>{model.name}</h3>
      </Link>
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
      <div>
        <h1 className="page-header">Dashboard</h1>
        <div className="row">
          <div className="col-md-3">
            <Link className="btn btn-primary btn-block" to="/train-model">Train Model</Link>
          </div>
          <div className="col-md-9">
            { mlModels
              ? this.renderMLModels(mlModels)
              : this.renderEmptyState() }
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
