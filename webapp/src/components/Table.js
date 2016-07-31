/* @flow */

import { reduce } from 'lodash';

import React, { PropTypes } from 'react';

import IndeterminableCheckbox from './IndeterminableCheckbox';

export default class Table extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    data: React.PropTypes.array,
    selectedRows: React.PropTypes.object,
    onSelect: PropTypes.func,
    onSelectAll: PropTypes.func,
    className: PropTypes.string
  };

  constructor(props: Object) {
    super(props);
    (this:any).renderSelectCheckbox = this.renderSelectCheckbox.bind(this);
    (this:any).handleSelectAll = this.handleSelectAll.bind(this);
  }

  handleSelectAll(e: SyntheticEvent) {
    this.props.onSelectAll(e.target.checked);
  }

  isSelected(key: number) {
    return this.props.selectedRows[key];
  }

  isAllSelected() {
    const { data, selectedRows } = this.props;

    const count = reduce(selectedRows,
                         (accum, value) => accum + (value ? 1 : 0));

    return count === data.length
      ? true
      : (count > 0 ? 'indeterminate' : false);
  }

  renderSelectAllCheckbox() {
    return {
      component: (
        <IndeterminableCheckbox
          checked={this.isAllSelected()}
          onChange={this.handleSelectAll}
        />
      ),
      tdStyle: { width: 30, maxWidth: 30 }
    };
  }

  renderSelectCheckbox(item: {id: number}) {
    return (
      <input
        type="checkbox"
        checked={this.isSelected(item.id)}
        onChange={e => this.props.onSelect(item.id, e.target.checked)}
      />
    );
  }

  render() {
    const {
      children,
      data,
      onSelect,
      onSelectAll,
      className
    } = this.props;

    const isSelectable = onSelect || onSelectAll;

    const selectAllHeader = isSelectable
      ? this.renderSelectAllCheckbox()
      : null;

    const headers: Array<any> = (
      isSelectable ? [selectAllHeader] : []
    ).concat(
      React.Children.map(children, child => child.props.header)
    );

    const cells = (
      isSelectable ? [this.renderSelectCheckbox] : []
    ).concat(
      React.Children.map(children, child => child.props.cell)
    );

    return (
      <table className={className}>
        <thead>
          <tr>
          {headers.map((header, key) =>
            header
            ? (
              <th
                key={key}
                className={header.tdClassName}
                style={header.tdStyle}
              >
                {header.name || header.component || header}
              </th>
            )
            : null
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
