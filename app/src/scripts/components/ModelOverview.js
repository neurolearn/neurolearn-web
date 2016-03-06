import React, { PropTypes } from 'react';

import { algorithmNameMap } from '../constants/Algorithms';
import { pluralize } from '../utils.js';

const ModelOverview = ({model}) => (
  <div>
    <table className="table overview">
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
          <td>{model.label_name}</td>
          <td>{model.images_count} {pluralize(model.images_count, 'image', 'images')}</td>
        </tr>
      </tbody>
    </table>
  </div>
);

ModelOverview.propTypes = {
  model: PropTypes.object.isRequired
};

export default ModelOverview;
