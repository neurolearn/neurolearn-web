import React, { PropTypes } from 'react';
import Spinner from '../components/Spinner';
import { connect } from 'react-redux';

export default class ViewModel extends React.Component {
  static propTypes = {
    params: PropTypes.object.isRequired
  }

  renderProgress() {
    return (
      <div className="col-md-12" >
        <div style={{'padding-top': 30, 'height': 30}}><Spinner opts={{position: 'relative'}}/></div>
        <div style={{'color': 'gray', 'margin': 40, 'text-align': 'center'}}>Model training is in progress…</div>
      </div>
    );
  }

  render() {
    const { mlModels, params } = this.props;
    const model = mlModels[parseInt(params.id)];

    return (
      <div>
        <h1 className="page-header">{model.name}</h1>
        <div className="row">
        { model.training_state === 'queued' &&
            this.renderProgress()
        }
        </div>
      </div>
    );
  }
}

function select(state) {
  return state;
}

export default connect(select)(ViewModel);

