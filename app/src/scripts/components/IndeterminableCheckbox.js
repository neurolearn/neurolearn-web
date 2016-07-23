/* @flow */

import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';

// Excerpt from https://github.com/AllenFang/react-bootstrap-table

export default class Checkbox extends React.Component {
  static propTypes = {
    checked: PropTypes.oneOf([true, false, 'indeterminate']),
    onChange: PropTypes.func
  };

  componentDidMount() {
    this.update(this.props.checked);
  }

  componentWillReceiveProps(props: Object) {
    this.update(props.checked);
  }

  update(checked: boolean) {
    ReactDOM.findDOMNode(this).indeterminate = checked === 'indeterminate';
  }

  render() {
    const { checked, onChange } = this.props;
    return (
      <input type='checkbox' checked={checked} onChange={onChange} />
    );
  }
}
