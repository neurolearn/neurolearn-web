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
        <td style={{borderBottom: '1px solid #eee', borderTop: '1px solid #eee', borderRight: '1px solid #979797'}}>
          <div>
            <h3>{image.name}</h3>
            <p>{this.collectionNameById(image.collection_id)}</p>
          </div>
        </td>
        <td style={{borderBottom: '1px solid #eee', borderTop: '1px solid #eee', borderRight: '1px solid #979797'}}>
          {image.r < 0 &&
            <div style={{backgroundColor: '#d8d8d8', height: 37, width: image.r * 150, float: 'right'}}>{image.r.toFixed(4)}</div>
          }
        </td>
        <td style={{border: '1px solid #eee', borderRight: '1px solid #979797'}}>
          {image.r >= 0 &&
            <div style={{backgroundColor: '#d8d8d8', height: 37, width: image.r * 150}}>{image.r.toFixed(4)}</div>
          }
        </td>
        <td style={{borderBottom: '1px solid #eee', borderTop: '1px solid #eee', width: 10}}>
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
          <td style={{borderRight: '1px solid #979797', height: 10}}></td>
          <td style={{borderRight: '1px solid #979797', height: 10, width: 150}}></td>
          <td style={{borderRight: '1px solid #979797', height: 10, width: 150}}></td>
          <td></td>
        </tr>

        {images.map((image, i) => this.renderRow(image, i))}

        <tr key='bottom'>
          <td style={{borderRight: '1px solid #979797', height: 10}}></td>
          <td style={{borderRight: '1px solid #979797', height: 10}}></td>
          <td style={{borderRight: '1px solid #979797', height: 10}}></td>
          <td></td>
        </tr>

      </table>
    );
  }
}
