/* @flow */

import React, { PropTypes } from 'react';
import FallbackImage from '../components/FallbackImage';

import { neuroVaultImageURL } from '../utils';

type TrainingDataItem = {
  id: number,
  name: string,
  target: Object,
  collection_id: number
};

const ModelTrainingData = (
  { inputData }
: { inputData: { label: { name: string },
                 collections: Object,
                 data: Array<TrainingDataItem>} }
) => (
  <table className="table">
    <thead>
      <tr>
        <th>Image</th>
        <th title="Training Label">{inputData.label.name}</th>
      </tr>
    </thead>
    <tbody>
      {inputData.data.map(row => <tr key={row.id}>
          <td>
            <FallbackImage src={`http://neurovault.org/media/images/${row.collection_id}/glass_brain_${row.id}.jpg`} />
            <p><a href={neuroVaultImageURL(row.id)}>{row.name}</a></p>
            <p style={{fontSize: 12, color: 'gray'}}>{inputData.collections[row.collection_id].name}</p>
          </td>
          <td>{row.target}</td>
        </tr>)}
    </tbody>
  </table>
);

ModelTrainingData.propTypes = {
  inputData: PropTypes.object.isRequired
}

export default ModelTrainingData;
