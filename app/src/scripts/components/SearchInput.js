import React, { PropTypes } from 'react';
import { Input } from 'react-bootstrap';

export default class SearchInput extends React.Component {
  static propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired
  }

  handleChange() {
    this.props.onChange(this.refs.input.getValue());
  }

  render() {
    return (
      <Input
        type='text'
        value={this.props.value}
        placeholder='Search NeuroVault Collections'
        ref='input'
        onChange={this.handleChange.bind(this)} />
    );
  }
}
