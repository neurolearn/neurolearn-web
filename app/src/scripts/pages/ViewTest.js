import React, { PropTypes } from 'react';
import { Button, ButtonToolbar } from 'react-bootstrap';
import { connect } from 'react-redux';

import Spinner from '../components/Spinner';
import ImageBarChart from '../components/ImageBarChart';
import { deleteMLModel } from '../state/modelTests';

export default class ViewTest extends React.Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    modelTests: PropTypes.object,
    dispatch: PropTypes.func.isRequired
  }

  static contextTypes = {
    router: PropTypes.object.isRequired
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
        <div style={{'padding-top': 30, 'height': 30}}><Spinner opts={{position: 'relative'}}/></div>
        <div style={{'color': 'gray', 'margin': 40, 'text-align': 'center'}}>Model testing is in progress…</div>
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

    return (
      <div className="col-md-12">
        <p>Result for model test #{model.id}</p>

        <ImageBarChart images={model.output_data.correlation} collections={model.output_data.collections} />

        <div className='download' style={{marginTop: 20}}>
          {/*<a className="btn btn-default" href={`/media/${model.id}/Pattern_Expression_correlation.csv`}>Download correlation as CSV</a>*/}
        </div>
      </div>
    );
  }

  handleDelete(modelId) {
    const { router } = this.context;

    this.props.dispatch(deleteMLModel(modelId, router));
  }

  render() {
    const { modelTests, params } = this.props;
    const model = modelTests[parseInt(params.id)];

    return (
      <div>
        <div className="page-header">
          <ButtonToolbar className="pull-right">
            <Button bsStyle="danger"
                    onClick={() => this.handleDelete(model.id)}>Delete</Button>
          </ButtonToolbar>
          <h1>{model.name}</h1>
        </div>
        <div className="row">
        { this.renderState(model) }
        </div>
      </div>
    );
  }
}

function select(state) {
  return state;
}

export default connect(select)(ViewTest);

