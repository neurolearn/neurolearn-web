import React, { PropTypes } from 'react';
import Spinner from '../components/Spinner';
import { connect } from 'react-redux';
import NSViewer from '../components/NSViewer';

export default class ViewModel extends React.Component {
  static propTypes = {
    params: PropTypes.object.isRequired
  }

  renderState(model) {
    switch (model.training_state) {
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
        <div style={{'color': 'gray', 'margin': 40, 'text-align': 'center'}}>Model training is in progress…</div>
      </div>
    );
  }

  renderFailure(model) {
    return (
      <div className="col-md-12">
        <div className="alert alert-danger">
          <h4>Training Failed</h4>
          {model.output_data.error}
        </div>
      </div>
    );
  }

  renderModel(model) {
      const algorithm = 'svm';
      const weightmapUrl = `/media/${model.id}/${model.output_data.weightmap}`;
      const images = [
      {
        id: 'anatomical',
        json: false,
        name: 'anatomical',
        colorPalette: 'grayscale',
        cache: true,
        download: '/static/data/anatomical.nii.gz',
        url: '/static/data/anatomical.nii.gz'
      },
      {
        'url': weightmapUrl,
        'name': `${algorithm} weight map`,
        'colorPalette': 'green',
        'intent': 'z-score:'
      }
    ];

    return (
      <div className="col-md-12">
        <p>Result weight map for {algorithm} analysis #{model.id}</p>

        <div className='NSViewer'>
          <NSViewer images={images} />
        </div>

        <div className='ScatterPlot' style={{marginTop: 20}}>
          <img src={`/media/${model.id}/${model.output_data.scatterplot}`}/>
        </div>

        <div className='download' style={{marginTop: 20}}>
          <a className="btn btn-default" href={weightmapUrl}>Download the Weight Map</a>
        </div>
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
        { this.renderState(model) }
        </div>
      </div>
    );
  }
}

function select(state) {
  return state;
}

export default connect(select)(ViewModel);

