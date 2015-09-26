import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';

import styles from './GroupLabel.scss';

export default class GroupLabel extends React.Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
    onSelect: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    index: PropTypes.number,
    selected: PropTypes.number
  }

  constructor(props) {
    super(props);
    this.state = {
      editing: false
    };
  }

  handleClick(e) {
    e.preventDefault();
    this.props.onSelect(this.props.index);
  }

  handleEdit(e) {
    e.preventDefault();
    this.setState({ editing: true });
  }

  handleCancel() {
    this.setState({ editing: false });
  }

  handleDelete(e) {
    e.preventDefault();
    this.props.onDelete(this.props.index);
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.editing && this.state.editing) {
      const node = this.refs.editInput.getDOMNode();
      node.focus();
      node.setSelectionRange(node.value.length, node.value.length);
    }
  }

  render() {
    const { item, index, selected } = this.props;
    const { editing } = this.state;
    return (
      <div className={editing ? styles.editing : styles.viewing} style={{backgroundColor: index === selected ? '#eee' : 'white', height: 70}}>
        <a href="#" className="view" onClick={this.handleClick.bind(this)}>{item.name}</a>
        <input className="edit" ref="editInput" value={item.name} />
        <div className="view pull-right">
          <a style={{padding: '8px 10px'}} href="#" onClick={this.handleEdit.bind(this)}>Edit</a>
          <a href="#" onClick={this.handleDelete.bind(this)}>Delete</a>
        </div>
        <div className="edit pull-right">
          <Button bsStyle='default' onClick={this.handleCancel.bind(this)}>Cancel</Button>
          <Button bsStyle='primary'>Save</Button>
        </div>
      </div>
    );
  }
}
