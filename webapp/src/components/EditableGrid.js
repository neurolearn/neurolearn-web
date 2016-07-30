/* @flow */

import React, { PropTypes } from 'react';
import 'handsontable.full.js';

export default class EditableGrid extends React.Component {
  static propTypes = {
    data: PropTypes.array,
    headers: PropTypes.array
  }

  hot: Object;

  initHandsontableInstance(data: number, headers: number) {
    const container = this.refs.hot;

    const hot = new window.Handsontable(container, {
      data: data,
      colHeaders: headers,
      rowHeaders: true,
      contextMenu: {
        items: {
          'undo': {},
          'redo': {}
        }
      },
      cells: function (r, c) {
        if (c < 3) {
          return {
            readOnly: true
          };
        }
      }
    });

    return hot;
  }

  componentDidMount() {
    const {data, headers} = this.props;
    this.hot = this.initHandsontableInstance(data, headers);
  }

  componentDidUpdate() {
    const {data, headers} = this.props;
    this.hot = this.initHandsontableInstance(data, headers);
  }

  componentWillUnmount() {
    this.hot.destroy();
  }

  shouldComponentUpdate() {
    this.hot.destroy();
    return true;
  }

  render() {
    return (
      <div className="DataGrid" style={{height: 320, overflow: 'hidden'}}>
        <div ref="hot" />
      </div>
    );
  }
}
