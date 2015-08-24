import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

export default class ViewModel extends React.Component {
  static propTypes = {
    params: PropTypes.object.isRequired
  }

  componentDidMount() {
    const { params } = this.props;
  }

  render() {
    return (
      <div>View Model { this.props.params.id }</div>
    );
  }
}

function select(state) {
  return state;
}

export default connect(select)(ViewModel);
