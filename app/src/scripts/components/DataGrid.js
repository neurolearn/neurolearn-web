import findIndex from 'lodash/array/findIndex';
import React, { PropTypes } from 'react';

require('handsontable');
window.Formula = require('formula.js');
require('parser.js');
require('ruleJS.js');
require('handsontable.formula.js');

export default class DataGrid extends React.Component {
  static propTypes = {
    data: PropTypes.array,
    targetData: PropTypes.object,
    onSelectTarget: PropTypes.func.isRequired
  }

  initHandsontableInstance(data, targetData) {
    var container = this.refs.hot,
        _this = this;

    var hot = new window.Handsontable(container, {
      data: data,
      rowHeaders: true,
      colHeaders: true,
      formulas: true
    });

    var selectedColumns = {
      subjectId: null,
      trainingLabel: targetData.trainingLabel.index
    };

    function makeBackground(col, td) {
      if (col === selectedColumns.subjectId) {
        td.style.background = '#43aafd';
      }
      if (col === selectedColumns.trainingLabel) {
        td.style.background = '#f48225';
      }
    }

    function firstRowRenderer(instance, td, row, col) {
      window.Handsontable.renderers.TextRenderer.apply(this, arguments);
      td.style.fontWeight = 'bold';

      makeBackground(col, td);
    }

    function columnSelectorRenderer(instance, td, row, col) {
      window.Handsontable.TextCell.renderer.apply(this, arguments);
      makeBackground(col, td);
    }

    function findColumnIndex(tableData, colName) {
      return findIndex(tableData[0], col => col === colName);
    }

    function columnName (tableData, columnIndex) {
      return tableData[0][columnIndex];
    }

    function getTargetData(columnIndex) {
      const tableData = hot.getData();
      const idIndex = findColumnIndex(tableData, 'id');
      const collectionIdIndex = findColumnIndex(tableData, 'collection_id');

      const trainingData = tableData.slice(1).map(function (row) {
        return {
          'id': row[idIndex],
          'subject_id': row[columnIndex.subjectId],
          target: row[columnIndex.trainingLabel],
          'collection_id': row[collectionIdIndex]
        };
      });

      return {
        trainingLabel: {
          index: columnIndex.trainingLabel,
          name: columnName(tableData, columnIndex.trainingLabel)
        },
        data: trainingData
      };
    }

    function useColumnAs(name, col) {
      selectedColumns[name] = col;
      if (selectedColumns.trainingLabel !== null ) {
        _this.props.onSelectTarget(getTargetData(selectedColumns));
      }

      hot.render();
    }

    hot.updateSettings({
      contextMenu: {
        callback: function (key) {
          if (key === 'use_as_subject_id') {
            useColumnAs('subjectId', hot.getSelected()[1]);
          } else if (key === 'use_as_training_label') {
            useColumnAs('trainingLabel', hot.getSelected()[1]);
          }
        },
        items: {
          'use_as_training_label': {
            name: 'Use as Training Label'
          },
          'use_as_subject_id': {
            name: 'Use as Subject ID'
          },
          'hsep2': '---------',
          'col_left': {},
          'col_right': {},
          'hsep3': '---------',
          'remove_col': {},
          'hsep4': '---------',
          'undo': {},
          'redo': {}
        }
      },
      cells: function (row, col, prop) {
        var cellProperties = {};
        if (row === 0) {
          cellProperties.renderer = firstRowRenderer;
        } else {
          cellProperties.renderer = columnSelectorRenderer;
        }
        return cellProperties;
      }
    });

    return hot;
  }

  componentDidMount() {
    this.hot = this.initHandsontableInstance(this.props.data,
                                             this.props.targetData);
  }

  componentDidUpdate() {
    this.hot = this.initHandsontableInstance(this.props.data,
                                             this.props.targetData);
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
        <div ref="hot"/>
      </div>
    );
  }
}
