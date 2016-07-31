/* @flow */

import { values, keys, some, pick, isEmpty, identity, zipObject } from 'lodash';
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

const POLL_INTERVAL = 2500;
const FETCHED_KEY = 'dashboardModels';

class MLModels extends React.Component {
  state: {
    selectedRows: Object
  };

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    items: PropTypes.array,
    auth: PropTypes.object
  };

  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  interval: number;

  constructor(props: Object) {
    super(props);
    this.state = {
      selectedRows: {}
    };

    (this:any).handleTrainNewModel = this.handleTrainNewModel.bind(this);
    (this:any).handleToggleRow = this.handleToggleRow.bind(this);
    (this:any).handleToggleAll = this.handleToggleAll.bind(this);
    (this:any).handleDeleteSelected = this.handleDeleteSelected.bind(this);
  }

  loadAuthUserMLModels() {
    this.props.dispatch(fetchJSON('/api/user/models', FETCHED_KEY));
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

  handleToggleAll(checked) {
    const { items } = this.props;
    this.setState({ selectedRows: zipObject(items.map(x => [x.id, checked])) });
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

    dispatch(deleteItemList('/api/deletes/models', FETCHED_KEY, itemKeys,
      () => this.setState({selectedRows: {}})
    ));
  }

  renderItems(items) {
    return (
      <Table data={items}
        selectedRows={this.state.selectedRows}
        onSelect={this.handleToggleRow}
        onSelectAll={this.handleToggleAll}
        className="table table-hover">
        <Column
          header={{name: 'Name', tdClassName: 'col-md-3'}}
          cell={x => [
            <Link to={`/models/${x.id}`}>{x.name}</Link>,
            (x.private &&
              <i
                title="Private model"
                className="fa fa-lock"
                style={{marginLeft: 4, color: 'gray'}}
                aria-hidden="true"></i>)
          ]} />
        <Column header="Status" cell={x => <TaskStateLabel state={x.state} />} />
        <Column header="Algorithm" cell={x => algorithmNameMap[x.algorithm]} />
        <Column header="Cross-validation Type" cell={x => x.cv ? x.cv.type : ''} />
        <Column
          header="Training Duration"
          cell={x => x.training_duration && (Math.floor(x.training_duration) + ' sec')}
        />
        <Column
          header="Created"
          cell={x => <span className="datetime">{moment(x.created).fromNow()}</span>}
        />
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
            <Button
              bsStyle="primary"
              onClick={this.handleTrainNewModel}><i className="fa fa-plus"></i> New Model</Button>
            <Button
              disabled={someSelected}
              onClick={this.handleDeleteSelected}><i className="fa fa-trash"></i> Delete</Button>
          </ButtonToolbar>
        </DashboardNav>

        <div className="row">
          <div className="col-md-12">
            {isEmpty(items)
              ? this.renderEmptyState()
              : this.renderItems(items)}
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
  };
}

export default connect(select)(MLModels);
