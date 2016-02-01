import { values, sortByOrder, isEmpty } from 'lodash';
import moment from 'moment';

import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';

import { Link } from 'react-router';
import { connect } from 'react-redux';
import { loadItemList } from '../../state/itemList';


import { resetModelTrainData } from '../../state/modelPreferences';
import { algorithmNameMap } from '../../constants/Algorithms';
import TaskStateLabel from '../../components/TaskStateLabel';
import DashboardNav from '../../components/DashboardNav';
import styles from './MLModels.scss';

const POLL_INTERVAL = 2500;

export default class MLModels extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    itemList: PropTypes.object,
    auth: PropTypes.object
  };

  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  loadAuthUserMLModels() {
    this.props.dispatch(loadItemList('/api/user/models'));
  }

  componentDidMount() {
    this.loadAuthUserMLModels();
    this.interval = setInterval(this.loadAuthUserMLModels.bind(this), POLL_INTERVAL);
  }

  componentWillReceiveProps() {
    const { auth } = this.props;
    const { router } = this.context;

    if (!auth.user) {
      router.push('/');
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  handleTrainNewModel() {
    const { router } = this.context;
    resetModelTrainData(this.props.dispatch);
    router.push('/models/new');
  }

  renderMLModels(mlModels) {
    const { items } = mlModels;

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
    const { itemList } = this.props;

    return (
      <div className={styles.root}>
        <DashboardNav>
          <Button bsStyle="primary"
                  className="pull-right"
                  onClick={this.handleTrainNewModel.bind(this)}><i className="fa fa-plus"></i> New Model</Button>
        </DashboardNav>

        <div className="row">
          <div className="col-md-12">
            { isEmpty(itemList.items)
              ? this.renderEmptyState()
              : this.renderMLModels(itemList) }
          </div>
        </div>
      </div>
    );
  }
}

function select(state) {
  return state;
}

export default connect(select)(MLModels);
