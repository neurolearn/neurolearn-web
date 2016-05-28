import { values, keys, some, pick, isEmpty, identity } from 'lodash';
import moment from 'moment';

import React, { PropTypes } from 'react';
import { Button, ButtonToolbar } from 'react-bootstrap';

import { Link } from 'react-router';
import { connect } from 'react-redux';
import { fetchJSON, deleteItemList } from '../../state/fetched';

import { resetModelTrainData } from '../../state/modelPreferences';
import { algorithmNameMap } from '../../constants/Algorithms';
import TaskStateLabel from '../../components/TaskStateLabel';
import DashboardNav from '../../components/DashboardNav';
import Table from '../../components/Table';
import Column from '../../components/Column';
import styles from './MLModels.scss';

const POLL_INTERVAL = 12500;

export default class MLModels extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    items: PropTypes.array,
    auth: PropTypes.object
  };

  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      selectedRows: {}
    };
    this.handleTrainNewModel = this.handleTrainNewModel.bind(this);
    this.handleToggleRow = this.handleToggleRow.bind(this);
    this.handleDeleteSelected = this.handleDeleteSelected.bind(this);
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

  handleToggleRow(key, value) {
    const { selectedRows } = this.state;
    this.setState({
      selectedRows: Object.assign({}, selectedRows, {[key]: value})
    });
  }

  handleTrainNewModel() {
    const { router } = this.context;
    resetModelTrainData(this.props.dispatch);
    router.push('/models/new');
  }

  handleDeleteSelected() {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    const itemKeys = keys(pick(selectedRows, identity));

    dispatch(deleteItemList('/api/deletes/models', itemKeys,
      () => this.setState({selectedRows: {}})
    ));
  }

  renderMLModels(items) {
    return (
      <Table data={items} selectedRows={this.state.selectedRows} onSelect={this.handleToggleRow} onSelectAll={e => e}>
        <Column header="Name"
                cell={x => <Link to={`/models/${x.id}`}>{x.name}</Link>} />
        <Column header="Status"
                cell={x => <TaskStateLabel state={x.state}/>} />
        <Column header="Algorithm"
                cell={x => algorithmNameMap[x.algorithm]} />
        <Column header="Cross-validation Type"
                cell={x => x.cv ? x.cv.type : ''} />
        <Column header="Training Duration"
                cell={x => x.training_duration
                           && (Math.floor(x.training_duration)
                           + ' sec')} />
        <Column header="Created"
                cell={x => <span className="datetime">{moment(x.created).fromNow()}</span>} />
      </Table>
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

    const { selectedRows } = this.state;
    const someSelected = !some(values(selectedRows));

    return (
      <div className={styles.root}>
        <DashboardNav>
          <ButtonToolbar className="pull-right">

          <Button bsStyle="primary"
                  onClick={this.handleTrainNewModel}><i className="fa fa-plus"></i> New Model</Button>
          <Button disabled={someSelected}
                  onClick={this.handleDeleteSelected}><i className="fa fa-trash"></i> Delete</Button>
          </ButtonToolbar>
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
