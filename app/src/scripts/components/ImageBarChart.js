import React, { PropTypes } from 'react';

export default class ImageBarChart extends React.Component {
  static propTypes = {
    images: PropTypes.array.isRequired,
    collections: PropTypes.object.isRequired
  }

  collectionNameById(id) {
    return this.props.collections[id].name;
  }


  renderRow(image, key) {
    return (
      <tr key={key}>
        <td style={{borderBottom: '1px solid #ddd', borderTop: '1px solid #ddd'}}>
          <div>
            <h3>{image.name}</h3>
            <p>{this.collectionNameById(image.collection_id)}</p>
          </div>
        </td>
        <td style={{border: '1px solid #ddd'}}>
          {image.r < 0 && image.r}
        </td>
        <td style={{border: '1px solid #ddd'}}>
          {image.r >= 0 && image.r}
        </td>
        <td style={{borderBottom: '1px solid #ddd', borderTop: '1px solid #ddd', width:10}}>
        </td>
      </tr>
    );
  }


  render() {
    const { images } = this.props;
    return (
      <table>
        <tr key='ticks'>
          <td></td>
          <td><span>-1</span></td>
          <td><span>0</span></td>
          <td><span>1</span></td>
        </tr>

        <tr key='top'>
          <td style={{borderRight: '1px solid #ddd', height: 10}}></td>
          <td style={{borderRight: '1px solid #ddd', height: 10}}></td>
          <td style={{borderRight: '1px solid #ddd', height: 10}}></td>
          <td></td>
        </tr>

        {images.map((image, i) => this.renderRow(image, i))}

        <tr key='bottom'>
          <td style={{borderRight: '1px solid #ddd', height: 10}}></td>
          <td style={{borderRight: '1px solid #ddd', height: 10}}></td>
          <td style={{borderRight: '1px solid #ddd', height: 10}}></td>
          <td></td>
        </tr>

      </table>
    );
  }
}
