import React, { PropTypes } from 'react';

import { algorithmNameMap } from '../constants/Algorithms';
import { pluralize } from '../utils.js';

const ModelOverview = ({model}) => (
  <div>
    <table className="table overview" style={{marginTop: 10}}>
      <thead>
        <tr>
          <td className="col-md-4">Algorithm</td>
          <td className="col-md-4">Training Label</td>
          <td className="col-md-4">Training Dataset</td>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{algorithmNameMap[model.algorithm]}</td>
          <td>{model.input_data.label.name}</td>
          <td>{model.input_data.data.length} {pluralize(model.input_data.data.length, 'image', 'images')}</td>
        </tr>
      </tbody>
    </table>
  </div>
);

ModelOverview.propTypes = {
  model: PropTypes.object.isRequired
};

export default ModelOverview;
