import React, { PropTypes } from 'react';

export default class GroupLabel extends React.Component {
  static propTypes = {
    item: PropTypes.object.isRequired
  }

  render() {
    const { item } = this.props;

    return (
      <div>
        <h3>{item.name}</h3>
      </div>
    );
  }
}
