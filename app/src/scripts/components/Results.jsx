import React from 'react';
import NSViewer from './NSViewer';

export default class Results extends React.Component {
  render() {
    var images = [
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
        'url': `/media/${this.props.jobid}/ridge_weightmap.nii.gz`,
        'name': `${this.props.algorithm} weight map`,
        'colorPalette': 'green',
        'intent': 'z-score:'
      }
    ];

    return (
      <div className="Results">
        <p>Result weight map for {this.props.algorithm} analysis id {this.props.jobid}</p>

        <div className='NSViewer'>
          <NSViewer images={images} />
        </div>

        <div className='WeightMapPlot' style={{marginTop: 20}}>
          <img style={{width: 80 + '%'}} src={'/media/' + this.props.jobid + '/' + this.props.algorithm + '_weightmap_axial.png'}/>
        </div>

        <div className='ScatterPlot' style={{marginTop: 20}}>
          <img src={'/media/' + this.props.jobid + '/' + this.props.algorithm + '_scatterplot.png'}/>
        </div>

        <div className='download' style={{marginTop: 20}}>
        <a className="btn btn-default" href={'/media/' + this.props.jobid + '/' + this.props.algorithm + '_weightmap.nii.gz'}>Download the Weight Map</a>
        </div>
      </div>
    );
  }
}
