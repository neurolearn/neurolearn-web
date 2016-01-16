import React from 'react';

export default class FallbackImage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errored: false
    };
  }

  handleError() {
    this.setState({errored: true});
  }

  render() {
    return this.state.errored
      ? null
      : <img onError={this.handleError.bind(this)} {...this.props} />;
  }
}
