import { isEmpty } from 'lodash';
import moment from 'moment';

import React, { PropTypes } from 'react';

import { Link } from 'react-router';
import { connect } from 'react-redux';
import { loadItemList } from '../../state/itemList';
import TaskStateLabel from '../../components/TaskStateLabel';
import DashboardNav from '../../components/DashboardNav';
import styles from './MLModels.scss';

const POLL_INTERVAL = 2500;

export default class ModelTests extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    itemList: PropTypes.object,
    auth: PropTypes.object
  };

  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  loadModelTests() {
    this.props.dispatch(loadItemList('/api/user/tests'));
  }

  componentDidMount() {
    this.loadModelTests();
    this.interval = setInterval(this.loadModelTests.bind(this), POLL_INTERVAL);
  }

  componentWillReceiveProps() {
    const { auth } = this.props;
    const { router } = this.context;

    if (!auth.user) {
      router.transitionTo('/');
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  renderItems(modelTests) {
    const models = modelTests.items;

    return (
      <table className="table table-hover">
        <thead>
          <tr>
            <th className="col-md-3">Name</th>
            <th>Status</th>
            <th>Test Duration</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          {
            models.map(model =>
              <tr key={model.id}>
                <td>
                  <Link to={`/tests/${model.id}`}>{model.name}</Link>
                </td>
                <td style={{height: 40}}>
                  <TaskStateLabel state={model.state}/>
                </td>
                <td>
                  { model.test_duration &&
                   (Math.floor(model.test_duration) + ' sec')}
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
        <h3 style={{'color': 'lightgray'}}>No Model Tests Yet</h3>
      </div>
    );
  }

  render() {
    const { itemList } = this.props;

    return (
      <div className={styles.root}>
        <DashboardNav router={this.context.router} />

        <div className="row">
          <div className="col-md-12">
            { isEmpty(itemList.items)
              ? this.renderEmptyState()
              : this.renderItems(itemList) }
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
