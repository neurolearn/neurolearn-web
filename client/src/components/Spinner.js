/* @flow */

import React from 'react';
import SpinSpinner from 'spin.js';

export default class Spinner extends React.Component {
  static propTypes = {
    opts: React.PropTypes.object
  }

  componentDidMount() {
    const spinner = new SpinSpinner(this.props.opts);
    spinner.spin(this.refs.spinner);
  }

  render() {
    return <span ref="spinner" />;
  }
}
