/* @flow */

import React, { PropTypes } from 'react';
import 'nsviewer.js';

export default class NSViewer extends React.Component {
  static propTypes = {
    images: PropTypes.array.isRequired,
    onImagesLoaded: PropTypes.func
  }

  componentDidMount() {
    var Viewer = window.Viewer;
    var viewer = new Viewer('#layer_list', '.layer_settings');
    viewer.addView('#view_axial', Viewer.AXIAL);
    viewer.addView('#view_coronal', Viewer.CORONAL);
    viewer.addView('#view_sagittal', Viewer.SAGITTAL);
    viewer.addSlider('opacity', '.slider#opacity', 'horizontal', 0, 1, 1, 0.05);
    viewer.addSlider('pos-threshold', '.slider#pos-threshold', 'horizontal', 0, 1, 0, 0.01);
    viewer.addSlider('neg-threshold', '.slider#neg-threshold', 'horizontal', 0, 1, 0, 0.01);
    viewer.addSlider('nav-xaxis', '.slider#nav-xaxis', 'horizontal', 0, 1, 0.5, 0.01, Viewer.XAXIS);
    viewer.addSlider('nav-yaxis', '.slider#nav-yaxis', 'vertical', 0, 1, 0.5, 0.01, Viewer.YAXIS);
    viewer.addSlider('nav-zaxis', '.slider#nav-zaxis', 'vertical', 0, 1, 0.5, 0.01, Viewer.ZAXIS);

    viewer.addColorSelect('#select_color');
    viewer.addSignSelect('#select_sign');
    viewer.addDataField('voxelValue', '#data_current_value');
    viewer.addDataField('currentCoords', '#data_current_coords');
    viewer.addTextField('image-intent', '#image_intent');
    viewer.clear();

    window.jQuery(viewer).on('imagesLoaded', this.props.onImagesLoaded);

    viewer.loadImages(this.props.images);
  }

  render() {
    return (
      <div>
        <div id="views_left">
          <div className="view" id="view_coronal">
            <canvas height="220" id="cor_canvas" width="220"></canvas>
            <div className="slider nav-slider-vertical" id="nav-yaxis"></div>
          </div>
          <div className="view" id="view_axial">
            <canvas height="264" id="axial_canvas" width="220"></canvas>
            <div className="slider nav-slider-vertical" id="nav-zaxis"></div>
          </div>
        </div>
        <div id="views_right">
          <div className="view" id="view_sagittal">
            <canvas height="220" id="sag_canvas" width="264"></canvas>
            <div className="slider nav-slider-horizontal" id="nav-xaxis"></div>
          </div>
          <div id="data_panel">
            <div className="data_display_row">
              <div className="data_label">Coordinates:</div>
              <div id="data_current_coords"></div>
            </div>
            <div className="data_display_row">
              <div id="image_intent" className="data_label">Initial value</div>
              <div id="data_current_value"></div>
            </div>
          </div>
        </div>

        <div id="layer_panel">
          <div id="layer_list_panel">
            <div>Layers</div>
            <div id="layer_visible_list"></div>
            <ul id="layer_list" className="layer_settings">
            </ul>
          </div>
          <div id="layer_settings_panel">
            Color palette:<select id="select_color" className="layer_settings"></select>
            Positive/Negative:<select id="select_sign" className="layer_settings"></select>
            Opacity:<div className="slider layer_settings" id="opacity"></div>
            Pos. threshold:<div className="slider layer_settings" id="pos-threshold"></div>
            Neg. threshold: <div className="slider layer_settings" id="neg-threshold"></div>
          </div>
        </div>
      </div>
    );
  }
}
