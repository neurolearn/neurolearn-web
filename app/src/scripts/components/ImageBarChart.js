import pluck from 'lodash/collection/pluck';
import React, { PropTypes } from 'react';

export default class ImageBarChart extends React.Component {
  static propTypes = {
    images: PropTypes.array.isRequired,
    collections: PropTypes.object.isRequired
  }

  collectionNameById(id) {
    return this.props.collections[id].name;
  }

  absMax(array) {
    return Math.max.apply(null, array.map(Math.abs));
  }

  rangeMax(array) {
    const m = 10;
    const span = this.absMax(array);
    let step = Math.pow(10, Math.floor(Math.log(span / m) / Math.LN10));
    let err = m / span * step;

    if (err <= .15) {
      step *= 10;
    }
    else if (err <= .35) {
      step *= 5;
    }
    else if (err <= .75) {
      step *= 2;
    }
    return Math.floor(span / step) * step + step * .5;
  }

  renderTicks(lower, higher) {
    return (
      <tr key='ticks'>
        <td></td>
        <td><span>{lower.toFixed(2)}</span></td>
        <td><span>0</span></td>
        <td><span>{higher.toFixed(2)}</span></td>
      </tr>
    );
  }

  scaleWidth(width, scaleMax, value) {
    return width * Math.abs(value) / scaleMax;
  }

  renderRow(key, image, maxTick) {
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
            <div style={{backgroundColor: '#d8d8d8', height: 37, width: this.scaleWidth(150, maxTick, image.r), float: 'right'}}>{image.r.toFixed(4)}</div>
          }
        </td>
        <td style={{border: '1px solid #eee', borderRight: '1px solid #979797'}}>
          {image.r >= 0 &&
            <div style={{backgroundColor: '#d8d8d8', height: 37, width: this.scaleWidth(150, maxTick, image.r)}}>{image.r.toFixed(4)}</div>
          }
        </td>
        <td style={{borderBottom: '1px solid #eee', borderTop: '1px solid #eee', width: 10}}>
        </td>
      </tr>
    );
  }

  render() {
    const { images } = this.props;
    const maxTick = this.rangeMax(pluck(images, 'r'));

    return (
      <table>
        {this.renderTicks(-maxTick, maxTick)}

        <tr key='top'>
          <td style={{borderRight: '1px solid #979797', height: 10}}></td>
          <td style={{borderRight: '1px solid #979797', height: 10, width: 150}}></td>
          <td style={{borderRight: '1px solid #979797', height: 10, width: 150}}></td>
          <td></td>
        </tr>

        {images.map((image, i) => this.renderRow(i, image, maxTick))}

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
