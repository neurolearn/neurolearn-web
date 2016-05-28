import { keys, every } from 'lodash';

import React, { PropTypes, cloneElement, createElement } from 'react';


export default class Table extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    data: React.PropTypes.array,
    selectedRows: React.PropTypes.object,
    onSelect: PropTypes.func,
    onSelectAll: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.renderSelectCheckbox = this.renderSelectCheckbox.bind(this);
  }

  isSelected(key) {
    return this.props.selectedRows[key];
  }

  isAllSelected() {
    const { data, selectedRows } = this.props;
    return (keys(selectedRows).length === data.length) && every(selectedRows);
  }

  renderSelectAllCheckbox() {
    return (
      <input type="checkbox"
             checked={this.isAllSelected()}
             onChange={e => this.props.onSelectAll(e.target.checked)} />
    );
  }

  renderSelectCheckbox(item) {
    return (
      <input type="checkbox"
             checked={this.isSelected(item.id)}
             onChange={e => this.props.onSelect(item.id, e.target.checked)} />
    );
  }

  render() {
    const { children, data, onSelect, onSelectAll } = this.props;

    const isSelectable = onSelect || onSelectAll;

    const selectAllHeader = isSelectable
      ? this.renderSelectAllCheckbox()
      : null;

    const headers = (
      isSelectable ? [selectAllHeader] : []
    ).concat(
      React.Children.map(children, child => child.props.header)
    );

    const cells = (
      isSelectable ? [this.renderSelectCheckbox] : []
    ).concat(
      React.Children.map(children, child => child.props.cell)
    )

    return (
      <table className="table table-hover">
        <thead>
          <tr>
          {headers.map((header, key) =>
            <th key={key}>
              {header}
            </th>
          )}
          </tr>
        </thead>
        <tbody>
        {
          data.map((item, rowKey) =>
            <tr key={rowKey}>
              {
                cells.map((cell, colKey) =>
                  <td key={`${rowKey}.${colKey}`}>
                    {cell(item)}
                  </td>
                )
              }
            </tr>
          )
        }
        </tbody>
      </table>
    );
  }
}
