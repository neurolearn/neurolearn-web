import { isEmpty, zipObject, identity, keys, pick, some, values } from 'lodash';
import moment from 'moment';

import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';

import { Link } from 'react-router';
import { connect } from 'react-redux';
import { fetchJSON, deleteItemList } from '../../state/fetched';

import TaskStateLabel from '../../components/TaskStateLabel';
import DashboardNav from '../../components/DashboardNav';
import Table from '../../components/Table';
import Column from '../../components/Column';

import styles from './MLModels.scss';

const POLL_INTERVAL = 2500;
const FETCHED_KEY = 'dashboardTests';


export default class ModelTests extends React.Component {
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
    this.handleToggleRow = this.handleToggleRow.bind(this);
    this.handleToggleAll = this.handleToggleAll.bind(this);
    this.handleDeleteSelected = this.handleDeleteSelected.bind(this);
  }

  loadModelTests() {
    this.props.dispatch(fetchJSON('/api/user/tests', FETCHED_KEY));
  }

  componentDidMount() {
    this.loadModelTests();
    this.interval = setInterval(this.loadModelTests.bind(this), POLL_INTERVAL);
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

  handleToggleAll(checked) {
    const { selectedRows } = this.state;
    const { items } = this.props;
    this.setState({ selectedRows: zipObject(items.map(x => [x.id, checked])) })
  }

  handleDeleteSelected() {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    const itemKeys = keys(pick(selectedRows, identity));

    dispatch(deleteItemList('/api/deletes/tests', FETCHED_KEY, itemKeys,
      () => this.setState({selectedRows: {}})
    ));
  }

  renderItems(items) {
    return (
      <Table data={items}
             selectedRows={this.state.selectedRows}
             onSelect={this.handleToggleRow}
             onSelectAll={this.handleToggleAll}
             className="table table-hover"
             >
        <Column header={{name: 'Name', tdClassName: 'col-md-4'}}
                cell={x => <Link to={`/tests/${x.id}`}>{x.name}</Link>} />
        <Column header="Status"
                cell={x => <TaskStateLabel state={x.state}/>} />
        <Column header="Test Duration"
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
        <h3 style={{'color': 'lightgray'}}>No Model Tests Yet</h3>
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
          <Button disabled={someSelected}
                  onClick={this.handleDeleteSelected}><i className="fa fa-trash"></i> Delete</Button>
        </DashboardNav>

        <div className="row">
          <div className="col-md-12">
            { isEmpty(items)
              ? this.renderEmptyState()
              : this.renderItems(items) }
          </div>
        </div>
      </div>
    );
  }
}

function select(state) {
  return {
    items: state.fetched[FETCHED_KEY],
    auth: state.auth
  }
}

export default connect(select)(ModelTests);
