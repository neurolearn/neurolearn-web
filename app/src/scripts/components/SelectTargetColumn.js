import includes from 'lodash/collection/includes';
import take from 'lodash/array/take';
import React, { PropTypes } from 'react';
import { getColumnsFromArray, guessType, findColumnIndex } from '../utils';
import EditColumnModal from './EditColumnModal';

import styles from './SelectTargetColumn.scss';

const excludeColumns = ['id', 'collection_id', 'name', 'file',
                        'url', 'file_size'];

function getTargetData(data, columnName) {
  const idIndex = findColumnIndex(data, 'id');
  const collectionIdIndex = findColumnIndex(data, 'collection_id');
  const nameIndex = findColumnIndex(data, 'name');
  const targetIndex = findColumnIndex(data, columnName);

  const trainingData = data
    .slice(1)
    .filter(row => row[idIndex] && row[collectionIdIndex])
    .map(row => {
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

function pickColumns(data, columnNames) {
  const indexes = columnNames.map(name => findColumnIndex(data, name));

  return data.map(row => indexes.map(index => row[index]));
}

export default class SelectTargetColumn extends React.Component {
  static propTypes = {
    data: PropTypes.array,
    targetData: PropTypes.object,
    onSelectTarget: PropTypes.func.isRequired,
    onColumnSave: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      showEditColumnModal: false,
      editColumnName: null,
      editColumnData: undefined
    }
    this.handleRadioChange = this.handleRadioChange.bind(this);
    this.handleNewColumnAdd = this.handleNewColumnAdd.bind(this);
    this.handleEditColumnModalHide = this.handleEditColumnModalHide.bind(this);
  }

  handleRadioChange(e) {
    const columnName = e.target.value;
    const { onSelectTarget, data } = this.props;
    onSelectTarget(getTargetData(data, columnName));
  }

  handleNewColumnAdd(e) {
    e.preventDefault();

    const newColumnData = pickColumns(
        this.props.data,
        ['id', 'collection_id', 'name']
    ).map((row, i) => [...row, i === 0 ? 'values' : '']);

    this.setState({
      showEditColumnModal: true,
      editColumnName: '',
      editColumnData: newColumnData
    });
  }

  handleColumnEdit(e, columnName) {
    this.setState({
      showEditColumnModal: true,
      editColumnName: columnName,
      editColumnData: pickColumns(
        this.props.data,
        ['id', 'collection_id', 'name', columnName]
      )
    });
  }

  handleEditColumnModalHide() {
    this.setState({ showEditColumnModal: false });
  }

  render() {
    const { data, targetData: { trainingLabel } } = this.props;
    const columns = getColumnsFromArray(
      data
    ).filter(
      column => !includes(excludeColumns, column.name)
    ).map(
      column => {
        return {
          name: column.name,
          dataType: guessType(column.values),
          sampleValues: take(column.values, 3)
        };
      }
    );

    return (
      <div className={styles.root}>
      <table className="table table-hover">
        <thead>
          <tr>
            <th>Target</th>
            <th>Name</th>
            <th>Data Type</th>
            <th>Sample Field Values</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {
            columns.map(column =>
              <tr key={column.name}>
                <td>
                  <input type="radio"
                         value={column.name}
                         onChange={this.handleRadioChange}
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
                <td style={{textAlign: 'right'}}>
                 <span className="action" onClick={(e) => this.handleColumnEdit(e, column.name)}><i className="fa fa-pencil"></i> Edit</span>
                 <span className="action"><i className="fa fa-trash"></i> Delete</span>
                </td>
              </tr>
            )
          }
          <tr>
            <td></td>
            <td colSpan="4">
              <a href="#" onClick={this.handleNewColumnAdd}>Add new column</a>
            </td>
          </tr>
        </tbody>
      </table>
      {this.state.editColumnData &&
        <EditColumnModal
          data={this.state.editColumnData}
          name={this.state.editColumnName}
          show={this.state.showEditColumnModal}
          onHide={this.handleEditColumnModalHide}
          onSave={this.props.onColumnSave}
          />}
      </div>
    );
  }
}