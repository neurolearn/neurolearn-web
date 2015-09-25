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

  render() {
    const { item, index, selected } = this.props;
    return (
      <div style={{backgroundColor: index === selected ? '#eee' : 'white', height: 70}}>
        <a href="#" onClick={this.handleClick.bind(this)}>{item.name}</a>
      </div>
    );
  }
}
