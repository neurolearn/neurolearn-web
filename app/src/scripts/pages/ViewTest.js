import React, { PropTypes } from 'react';
import { Button, ButtonToolbar } from 'react-bootstrap';
import { connect } from 'react-redux';
import api from '../api';

import Spinner from '../components/Spinner';
import ImageBarChart from '../components/ImageBarChart';
import { loadItemDetail, deleteItem } from '../state/itemDetail';

function saveCorrelationGroups(modelId, groups) {
  return (dispatch, getState) => {
    return api.post(`/api/tests/${modelId}/groups`,
      groups,
      getState().auth.token);
  };
}

export default class ViewTest extends React.Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    itemDetail: PropTypes.object,
    user: PropTypes.object,
    dispatch: PropTypes.func.isRequired
  }

  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  componentDidMount() {
    const { id } = this.props.params;
    this.props.dispatch(loadItemDetail(`/api/tests/${parseInt(id)}`));
  }

  handleDelete(testId) {
    const { router } = this.context;

    this.props.dispatch(deleteItem(`/api/tests/${testId}`,
      () => router.transitionTo('/dashboard/tests')
    ));
  }

  handleGroupsChange(modelId, groups) {
    this.props.dispatch(saveCorrelationGroups(modelId, groups));
  }

  renderState(model) {
    switch (model.state) {
      case 'queued':
      case 'progress':
        return this.renderProgress();
      case 'success':
        return this.renderModel(model);
      case 'failure':
        return this.renderFailure(model);
      default:
        throw 'Unknown model state.';
    }
  }

  renderProgress() {
    return (
      <div className="col-md-12" >
        <div style={{'paddingTop': 30, 'height': 30}}><Spinner opts={{position: 'relative'}}/></div>
        <div style={{'color': 'gray', 'margin': 40, 'textAlign': 'center'}}>Model testing is in progress…</div>
      </div>
    );
  }

  renderFailure(model) {
    return (
      <div className="col-md-12">
        <div className="alert alert-danger">
          <h4>Testing Failed</h4>
          {model.output_data.error}
        </div>
      </div>
    );
  }

  renderModel(model) {
    const {correlation, groups, collections} = model.output_data;

    return (
      <div className="col-md-12">
        <p>Result for model test #{model.id}</p>

        <ImageBarChart images={correlation}
                       groups={groups}
                       collections={collections}
                       onGroupsChange={newGroups => this.handleGroupsChange(model.id, newGroups)} />

        <div className='download' style={{marginTop: 20}}>
          {/*<a className="btn btn-default" href={`/media/${model.id}/Pattern_Expression_correlation.csv`}>Download correlation as CSV</a>*/}
        </div>
      </div>
    );
  }

  render() {
    const { itemDetail, user } = this.props;
    const item = itemDetail.item;

    if (!item || itemDetail.isFetching) {
      return <div>Loading test...</div>;
    }

    const userIsOwner = (item && user && item.user.id === item.user_id);

    return (
      <div>
        <div className="page-header">
          <ButtonToolbar className="pull-right">
            {userIsOwner &&
              <Button bsStyle="danger"
                      onClick={() => this.handleDelete(item.id)}>Delete</Button>}
          </ButtonToolbar>
          <h1>{item && item.name}</h1>
        </div>
        <div className="row">
        { item && this.renderState(item) }
        </div>
      </div>
    );
  }
}

function select(state) {
  return {
    itemDetail: state.itemDetail,
    user: state.auth.user
  };
}

export default connect(select)(ViewTest);

