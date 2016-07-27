/* @flow */

import React, { PropTypes } from 'react';
import { Input } from 'react-bootstrap';
import FallbackImage from './FallbackImage';

const ImageItem = (
  { name, checked, onChange, thumbnail, image_type, map_type }
: { name: string,
    checked: boolean,
    onChange: () => void,
    thumbnail: string,
    image_type: string,
    map_type: string }
) => (
  <tr>
    <td>
      <input type='checkbox' checked={checked} onChange={onChange}/>
    </td>
    <td onClick={onChange} className="name">{name}</td>
    <td>{image_type}</td>
    <td>{map_type}</td>
    <td onClick={onChange} className="map-thumbnail">
      <FallbackImage src={thumbnail} className="img-responsive" />
    </td>
  </tr>
);

ImageItem.propTypes = {
  checked: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
}

export default ImageItem;
