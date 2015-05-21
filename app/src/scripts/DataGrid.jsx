'use strict';

import React from 'react';

var ht = require('handsontable');

export default class DataGrid extends React.Component {
  componentDidMount() {
    var container = this.refs.hot.getDOMNode();
    var hot = new window.Handsontable(container, {
      // data: data,
      minSpareRows: 1,
      rowHeaders: true,
      colHeaders: true,
      contextMenu: true
    });
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <div className="DataGrid">
        <div ref="hot"/>
      </div>
    );
  }
}
