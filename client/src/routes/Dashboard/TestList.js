/* @flow */

import { isEmpty, zipObject, identity, keys, pick, some, values } from 'lodash';
import moment from 'moment';

import React, { PropTypes } from 'react';
import { Button, ButtonToolbar } from 'react-bootstrap';

import { Link } from 'react-router';
import { connect } from 'react-redux';
import { fetchJSON, deleteItemList } from '../../state/fetched';

import { resetModelTestData } from '../../state/testModel';

import TaskStateLabel from '../../components/TaskStateLabel';
import DashboardNav from '../../components/DashboardNav';
import Table from '../../components/Table';
import Column from '../../components/Column';

const POLL_INTERVAL = 2500;
const FETCHED_KEY = 'dashboardTests';

class TestList extends React.Component {
  state: {
    selectedRows: Object
  };

  interval: number;

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    items: PropTypes.array,
    auth: PropTypes.object
  };

  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  constructor(props: Object) {
    super(props);
    this.state = {
      selectedRows: {}
    };

    (this:any).handleNewTest = this.handleNewTest.bind(this);
    (this:any).handleToggleRow = this.handleToggleRow.bind(this);
    (this:any).handleToggleAll = this.handleToggleAll.bind(this);
    (this:any).handleDeleteSelected = this.handleDeleteSelected.bind(this);
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

  handleNewTest() {
    const { router } = this.context;
    resetModelTestData(this.props.dispatch);
    router.push('/tests/new');
  }

  handleToggleRow(key, value) {
    const { selectedRows } = this.state;
    this.setState({
      selectedRows: Object.assign({}, selectedRows, {[key]: value})
    });
  }

  handleToggleAll(checked) {
    const { items } = this.props;
    this.setState({ selectedRows: zipObject(items.map(x => [x.id, checked])) });
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
      <Table
        data={items}
        selectedRows={this.state.selectedRows}
        onSelect={this.handleToggleRow}
        onSelectAll={this.handleToggleAll}
        className="table table-hover"
      >
        <Column
          header={{name: 'Name', tdClassName: 'col-md-4'}}
          cell={x => <Link to={`/tests/${x.id}`}>{x.name}</Link>}
        />
        <Column
          header="Status"
          cell={x => <TaskStateLabel state={x.state} />}
        />
        <Column
          header="Test Duration"
          cell={x => x.test_duration && (Math.floor(x.test_duration) + ' sec')}
        />
        <Column header="Created"
          cell={x => <span className="datetime">{moment(x.created).fromNow()}</span>}
        />
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
      <div className="container">
        <DashboardNav>
          <ButtonToolbar className="pull-right">
            <Button
              bsStyle="primary"
              onClick={this.handleNewTest}
            >
              <i className="fa fa-plus"></i> New Test
            </Button>
            <Button
              disabled={someSelected}
              onClick={this.handleDeleteSelected}
            >
              <i className="fa fa-trash"></i> Delete
            </Button>
          </ButtonToolbar>
        </DashboardNav>

        <div className="row">
          <div className="col-md-12">
            {isEmpty(items) ? this.renderEmptyState() : this.renderItems(items)}
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    items: state.fetched[FETCHED_KEY],
    auth: state.auth
  };
}

export default connect(mapStateToProps)(TestList);
