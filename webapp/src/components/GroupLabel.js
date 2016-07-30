/* @flow */

import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import Events from '../utils/events';

import styles from './GroupLabel.scss';

export default class GroupLabel extends React.Component {
  state: {
    editing: boolean,
    editText: string
  };

  static propTypes = {
    item: PropTypes.object.isRequired,
    onSelect: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    index: PropTypes.number,
    selected: PropTypes.number
  }

  constructor(props: Object) {
    super(props);
    this.state = {
      editing: false,
      editText: this.props.item.name
    };

    (this:any).handleClick = this.handleClick.bind(this);
    (this:any).handleInputChange = this.handleInputChange.bind(this);
    (this:any).handleEdit = this.handleEdit.bind(this);
    (this:any).handleDelete = this.handleDelete.bind(this);
    (this:any).handleCancel = this.handleCancel.bind(this);
    (this:any).handleSave = this.handleSave.bind(this);
  }

  handleClick(e: SyntheticMouseEvent) {
    e.preventDefault();
    this.props.onSelect(this.props.index);
  }

  handleEdit(e: SyntheticMouseEvent) {
    e.preventDefault();
    this.setState({ editing: true });
  }

  handleCancel() {
    this.setState({
      editing: false,
      editText: this.props.item.name
    });
  }

  handleDelete(e: SyntheticMouseEvent) {
    e.preventDefault();
    this.props.onDelete(this.props.index);
  }

  handleInputChange(e: SyntheticInputEvent) {
    this.setState({editText: Events.target(e, HTMLInputElement).value});
  }

  handleSave() {
    this.props.onSave(this.props.index, this.state.editText);
    this.setState({editing: false});
  }

  componentDidUpdate(prevProps: Object, prevState: Object) {
    if (!prevState.editing && this.state.editing) {
      const node = this.refs.editInput;
      node.focus();
      node.setSelectionRange(node.value.length, node.value.length);
    }
  }

  render() {
    const { item, index, selected } = this.props;
    const { editing } = this.state;
    return (
      <div
        className={editing ? styles.editing : styles.viewing}
        style={{backgroundColor: index === selected ? '#eee' : 'white', height: 70}}
      >
        <span
          className="view group-title"
          onClick={this.handleClick}
        >{item.name}</span>
        <input
          className="edit"
          ref="editInput"
          value={this.state.editText}
          onChange={this.handleInputChange}
        />
        <div className="view pull-right">
          <span className="action pull-left" onClick={this.handleEdit}><i className="fa fa-pencil"></i> Edit</span>
          <span className="action pull-left" onClick={this.handleDelete}><i className="fa fa-trash"></i> Delete</span>
        </div>
        <div className="edit pull-right">
          <Button bsStyle="default" className="edit-action" onClick={this.handleCancel}>Cancel</Button>
          <Button bsStyle="primary" className="edit-action" onClick={this.handleSave}>Save</Button>
        </div>
      </div>
    );
  }
}
