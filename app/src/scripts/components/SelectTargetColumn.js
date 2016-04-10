import React, { PropTypes } from 'react';
import { parseColumns } from '../utils';
import { findColumnIndex } from '../utils';

function getTargetData(data, columnName) {
  const idIndex = findColumnIndex(data, 'id');
  const collectionIdIndex = findColumnIndex(data, 'collection_id');
  const nameIndex = findColumnIndex(data, 'name');
  const targetIndex = findColumnIndex(data, columnName);

  const trainingData = data
    .slice(1)
    .filter(row => row[idIndex] && row[collectionIdIndex])
    .map((row, i) => {
      return {
        'id': row[idIndex],
        'subject_id': undefined,
        'target': row[targetIndex],
        'collection_id': row[collectionIdIndex],
        'name': row[nameIndex]
      };
  });

  return {
    trainingLabel: {
      index: targetIndex,
      name: columnName
    },
    data: trainingData
  };
}

export default class SelectTargetColumn extends React.Component {
  static propTypes = {
    data: PropTypes.array,
    targetData: PropTypes.object,
    onSelectTarget: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.handleRadioChange = this.handleRadioChange.bind(this);
  }

  handleRadioChange(e) {
    const columnName = e.target.value;
    const { onSelectTarget, data } = this.props;
    onSelectTarget(getTargetData(data, columnName));
  }

  render() {
    const { data, targetData: { trainingLabel } } = this.props;
    const columns = parseColumns(data);

    return (
      <table className="table table-hover">
        <thead>
          <tr>
            <th>Target</th>
            <th>Name</th>
            <th>Data Type</th>
            <th>Sample Field Values</th>
          </tr>
        </thead>
        <tbody>
          {
            columns.map(column =>
              <tr key={column.name}>
                <td>
                  <input type="radio"
                         value={column.name}
                         onChange={this.handleRadioChange.bind(this)}
                         checked={column.name === trainingLabel.name}/>
                </td>
                <td>
                  {column.name}
                </td>
                <td>
                  {column.dataType}
                </td>
                <td>
                  {column.sampleValues.join(', ')}
                </td>
              </tr>
            )
          }
        </tbody>
      </table>
    );
  }
}
