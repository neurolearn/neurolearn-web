'use strict';

import React from 'react';
import NSViewer from './NSViewer';

export default class Results extends React.Component {
  render() {
    var images = [
    {
      'url': 'data/MNI152.nii.gz',
      'name': 'MNI152 2mm',
      'colorPalette': 'grayscale',
      'cache': false,
      'intent': 'Intensity:'
    },
    {
      'url': 'data/ridge_weightmap3.nii.gz',
      'name': 'reward meta-analysis',
      'colorPalette': 'green',
      'intent': 'z-score:'
    }];

    return (
      <div className="Results">
        <p>Result weight map for {this.props.algorithm} analysis id {this.props.jobid}</p>

        <div className='NSViewer'>
          <NSViewer images={images} />
        </div>

        <div className='WeightMapPlot'>
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
