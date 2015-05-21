'use strict';

import React from 'react';

require('handsontable');

export default class DataGrid extends React.Component {
  initHandsontableInstance(data) {
    var container = this.refs.hot.getDOMNode();

    var hot = new window.Handsontable(container, {
      data: data,
      minSpareRows: 1,
      rowHeaders: true,
      colHeaders: true,
      contextMenu: true
    });

    return hot;
  }

  componentDidMount() {
    this.hot = this.initHandsontableInstance(this.props.data);
  }

  componentDidUpdate() {
    this.hot = this.initHandsontableInstance(this.props.data);
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
      <div className="DataGrid">
        <div ref="hot"/>
      </div>
    );
  }
}
