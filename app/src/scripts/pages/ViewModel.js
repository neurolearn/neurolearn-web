import React, { PropTypes } from 'react';
import Spinner from '../components/Spinner';
import { connect } from 'react-redux';
import NSViewer from '../components/NSViewer';

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

  renderModel(model) {
      const algorithm = 'svm';
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
        'url': `/media/${model.id}/ridge_weightmap.nii.gz`,
        'name': `${algorithm} weight map`,
        'colorPalette': 'green',
        'intent': 'z-score:'
      }
    ];

    return (
      <div className="col-md-12">
        <p>Result weight map for {algorithm} analysis id {model.id}</p>

        <div className='NSViewer'>
          <NSViewer images={images} />
        </div>

        <div className='WeightMapPlot' style={{marginTop: 20}}>
          <img style={{width: 80 + '%'}} src={'/media/' + model.id + '/' + algorithm + '_weightmap_axial.png'}/>
        </div>

        <div className='ScatterPlot' style={{marginTop: 20}}>
          <img src={'/media/' + model.id + '/' + algorithm + '_scatterplot.png'}/>
        </div>

        <div className='download' style={{marginTop: 20}}>
        <a className="btn btn-default" href={'/media/' + model.id + '/' + algorithm + '_weightmap.nii.gz'}>Download the Weight Map</a>
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
        { model.training_state === 'queued' || model.training_state === 'progress'
          ? this.renderProgress()
          : this.renderModel(model)
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

