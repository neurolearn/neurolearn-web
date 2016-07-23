/* @flow */

import classNames from 'classnames';
import React, { PropTypes } from 'react';
import { Modal, Button, Input } from 'react-bootstrap';
import EditableGrid from './EditableGrid';

function pickColumn(data, index) {
  return data.map(row => row[index]);
}

const VALUE_COLUMN_INDEX = 3;

export default class EditColumnModal extends React.Component {
  state: {
    name: string
  };

  props: {
    name: string,
    data: Array<string | number>,
    onHide: () => void,
    onSave: () => void
  }

  static propTypes = {
    name: PropTypes.string,
    data: PropTypes.array,
    onHide: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired
  }

  _editableGrid: Object;

  constructor(props: Object) {
    super(props);
    this.state = {
      name: props.name
    };

    (this:any).handleNameChange = this.handleNameChange.bind(this);
    (this:any).handleSave = this.handleSave.bind(this);
  }

  handleNameChange(e: Object) {
    this.setState({name: this.refs.name.value});
  }

  handleSave() {
    const columnValues = pickColumn(this._editableGrid.hot.getData(),
                                    VALUE_COLUMN_INDEX);
    this.props.onSave(this.state.name, columnValues);
    this.props.onHide();
  }

  componentWillReceiveProps(nextProps: Object) {
    this.setState({
      name: nextProps.name
    });
  }

  render() {
    const { data } = this.props;

    return (
      <Modal {...this.props} aria-labelledby='contained-modal-title-lg'>
        <Modal.Header closeButton>
          <Modal.Title id='contained-modal-title-lg'>Edit Field</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <div className="form-group">
          <label>Name</label>
          <input type='text'
                 value={this.state.name}
                 onChange={this.handleNameChange}
                 ref="name"
                 className="form-control" />
        </div>
        <div className="form-group">
          <label>Data</label>
          <EditableGrid
            headers={data[0]}
            data={data.slice(1)}
            ref={c => this._editableGrid = c}
          />
        </div>
        {/* A div below fixes Handsontable issue with Copy & Paste in a Boostrap modal dialog */}
        <div id="CopyPasteDiv" style={{position: 'fixed', top: -10000, left: -10000}}><textarea className="copyPaste" style={{width: 10000, height: 10000, overflow: 'hidden', opacity: 0}}></textarea></div>
        </Modal.Body>
        <Modal.Footer>
          <Button bsStyle="primary" onClick={this.handleSave}>Save</Button>
          <Button onClick={this.props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
