import React, { PropTypes } from 'react';

export default class GroupLabel extends React.Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
    onSelect: PropTypes.func.isRequired,
    index: PropTypes.number,
    selected: PropTypes.number
  }

  handleClick(e) {
    e.preventDefault();
    this.props.onSelect(this.props.index);
  }

  handleEdit(e) {
    e.preventDefault();
    // this.props.onEdit(this.props.index);
  }

  handleDelete(e) {
    e.preventDefault();
    this.props.onDelete(this.props.index);
  }

  render() {
    const { item, index, selected } = this.props;
    return (
      <div style={{backgroundColor: index === selected ? '#eee' : 'white', height: 70}}>
        <a href="#" onClick={this.handleClick.bind(this)}>{item.name}</a>
        <div className="pull-right">
          <a style={{padding: '8px 10px'}} href="#" onClick={this.handleEdit.bind(this)}>Edit</a>
          <a href="#" onClick={this.handleDelete.bind(this)}>Delete</a>
        </div>
      </div>
    );
  }
}
