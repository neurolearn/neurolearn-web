/* @flow */

import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';

export default class InputWithSelectedText extends React.Component {
  componentDidMount() {
    ReactDOM.findDOMNode(this).select();
  }

  render() {
    return (
      <input type="text" {...this.props} />
    );
  }
}
