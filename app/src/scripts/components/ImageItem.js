import React, { PropTypes } from 'react';
import { Input } from 'react-bootstrap';
import FallbackImage from './FallbackImage';

export default class ImageItem extends React.Component {
  static propTypes = {
    checked: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired
  }

  render() {
    const { name, checked, onChange, thumbnail,
            image_type, map_type } = this.props;
    return (
      <tr>
        <td>
          <input type='checkbox' checked={checked} onChange={onChange}/>
        </td>
        <td>{name}</td>
        <td>{image_type}</td>
        <td>{map_type}</td>
        <td>
          <FallbackImage src={thumbnail} className="img-responsive" />
        </td>
      </tr>
    );
  }
}
