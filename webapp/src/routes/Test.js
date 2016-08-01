/* @flow */

import moment from 'moment';

import React, { PropTypes } from 'react';
import { Button, ButtonToolbar } from 'react-bootstrap';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import api from '../api';

import Spinner from '../components/Spinner';
import ImageBarChart from '../components/ImageBarChart';
import { fetchJSON, deleteItem } from '../state/fetched';

function saveCorrelationGroups(testId, groups) {
  return (dispatch, getState) => {
    return api.post(`/api/tests/${testId}/groups`,
      groups,
      getState().auth.token);
  };
}

class Test extends React.Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    test: PropTypes.object,
    user: PropTypes.object,
    isFetching: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired
  }

  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  componentDidMount() {
    const { id } = this.props.params;
    this.props.dispatch(
      fetchJSON(`/api/tests/${parseInt(id)}`, 'test'));
  }

  handleDelete(testId) {
    const { router } = this.context;

    this.props.dispatch(deleteItem(`/api/tests/${testId}`,
      () => router.push('/dashboard/tests')
    ));
  }

  handleGroupsChange(modelId, groups) {
    this.props.dispatch(saveCorrelationGroups(modelId, groups));
  }

  renderState(test) {
    switch (test.state) {
      case 'queued':
      case 'progress':
        return this.renderProgress();
      case 'success':
        return this.renderTest(test);
      case 'failure':
        return this.renderFailure(test);
      default:
        throw Error('Unknown test state.');
    }
  }

  renderProgress() {
    return (
      <div className="col-md-12" >
        <div style={{'paddingTop': 30, 'height': 30}}><Spinner opts={{position: 'relative'}} /></div>
        <div style={{'color': 'gray', 'margin': 40, 'textAlign': 'center'}}>Model testing is in progress…</div>
      </div>
    );
  }

  renderFailure(test) {
    return (
      <div className="col-md-12">
        <div className="alert alert-danger">
          <h4>Testing Failed</h4>
          {test.output_data.error}
        </div>
      </div>
    );
  }

  renderTest(test) {
    const {correlation, groups, collections} = test.output_data;
    const { modelId } = test.input_data;

    return (
      <div className="col-md-12">
        <p>Model: <Link to={`/models/${modelId}`}>{test.model.name}</Link></p>
        <ImageBarChart images={correlation}
          groups={groups}
          collections={collections}
          onGroupsChange={newGroups => this.handleGroupsChange(test.id, newGroups)}
        />
      </div>
    );
  }

  render() {
    const { user, test, isFetching } = this.props;

    if (!test || isFetching) {
      return <div>Loading test...</div>;
    }

    const userIsOwner = (test && user && test.user.id === user.id);

    return (
      <div>
        <div className="page-header">
          <ButtonToolbar className="pull-right">
            {userIsOwner &&
              <Button bsStyle="danger"
                onClick={() => this.handleDelete(test.id)}
              >Delete</Button>}
          </ButtonToolbar>
          <h1>{test && test.name}</h1>
          <div>{test.user.name}
            <span style={{color: 'gray'}}>created</span>
            <time style={{color: 'gray'}} className="datetime">{moment(test.created).fromNow()}</time>
          </div>
        </div>
        <div className="row">
        {test && this.renderState(test)}
        </div>
      </div>
    );
  }
}

function select(state) {
  return {
    test: state.fetched.test,
    isFetching: state.fetched.isFetching,
    user: state.auth.user
  };
}

export default connect(select)(Test);

