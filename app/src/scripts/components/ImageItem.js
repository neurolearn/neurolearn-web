import React, { PropTypes } from 'react';
import { Input } from 'react-bootstrap';

export default class ImageItem extends React.Component {
  static propTypes = {
    checked: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired
  }

  render() {
    return (
      <li>
        <Input type='checkbox'
               checked={this.props.checked}
               label={this.props.name}
               onChange={this.props.onChange}/>
      </li>
    );
  }
}
