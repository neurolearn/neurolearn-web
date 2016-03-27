import { values, sortByOrder, isEmpty } from 'lodash';
import moment from 'moment';

import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';

import { Link } from 'react-router';
import { connect } from 'react-redux';
import { fetchJSON } from '../../state/fetched';

import { resetModelTrainData } from '../../state/modelPreferences';
import { algorithmNameMap } from '../../constants/Algorithms';
import TaskStateLabel from '../../components/TaskStateLabel';
import DashboardNav from '../../components/DashboardNav';
import styles from './MLModels.scss';

const POLL_INTERVAL = 2500;

export default class MLModels extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    items: PropTypes.array,
    auth: PropTypes.object
  };

  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  loadAuthUserMLModels() {
    this.props.dispatch(fetchJSON('/api/user/models', 'dashboardModels'));
  }

  componentDidMount() {
    this.loadAuthUserMLModels();
    this.interval = setInterval(this.loadAuthUserMLModels.bind(this), POLL_INTERVAL);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  handleTrainNewModel() {
    const { router } = this.context;
    resetModelTrainData(this.props.dispatch);
    router.push('/models/new');
  }

  renderMLModels(items) {
    return (
      <table className="table table-hover">
        <thead>
          <tr>
            <th className="col-md-3">Name</th>
            <th>Status</th>
            <th>Algorithm</th>
            <th>Cross-validation Type</th>
            <th>Training Duration</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          {
            items.map(model =>
              <tr key={model.id}>
                <td>
                  <Link to={`/models/${model.id}`}>{model.name}</Link>
                </td>
                <td style={{height: 40}}>
                  <TaskStateLabel state={model.state}/>
                </td>
                <td>{algorithmNameMap[model.algorithm]}</td>
                <td>{model.cv.type}</td>
                <td>
                  { model.training_duration &&
                   (Math.floor(model.training_duration) + ' sec')}
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
      <div style={{'textAlign': 'center', marginTop: 50}}>
        <h3 style={{'color': 'lightgray'}}>No Trained Models Yet</h3>
      </div>
    );
  }

  render() {
    const { items } = this.props;

    return (
      <div className={styles.root}>
        <DashboardNav>
          <Button bsStyle="primary"
                  className="pull-right"
                  onClick={this.handleTrainNewModel.bind(this)}><i className="fa fa-plus"></i> New Model</Button>
        </DashboardNav>

        <div className="row">
          <div className="col-md-12">
            { isEmpty(items)
              ? this.renderEmptyState()
              : this.renderMLModels(items) }
          </div>
        </div>
      </div>
    );
  }
}

function select(state) {
  return {
    items: state.fetched.dashboardModels,
    auth: state.auth
  }
}

export default connect(select)(MLModels);
