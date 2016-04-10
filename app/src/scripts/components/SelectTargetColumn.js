import React, { PropTypes } from 'react';
import { parseColumns } from '../utils';

export default class SelectTargetColumn extends React.Component {
  render() {
    const { data } = this.props;
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
                  <input type="radio" checked={false}/>
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
