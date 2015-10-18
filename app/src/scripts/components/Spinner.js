import React from 'react';
import Spinner from 'spin.js';

export default class ReactSpinner extends React.Component {
  static propTypes = {
    opts: React.PropTypes.object
  }

  componentDidMount() {
    this.spinner = new Spinner(this.props.opts);
    this.spinner.spin(this.refs.spinner);
  }

  render() {
    return (
      <span ref="spinner" />
    );
  }
}
