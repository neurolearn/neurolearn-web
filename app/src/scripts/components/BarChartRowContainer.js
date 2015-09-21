import pluck from 'lodash/collection/pluck';
import React, { PropTypes } from 'react';

export default class BarChartRowContainer extends React.Component {
  static propTypes = {
    items: PropTypes.array.isRequired
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
        <td><span>{parseFloat(lower.toFixed(2))}</span></td>
        <td><span>0</span></td>
        <td><span>{parseFloat(higher.toFixed(2))}</span></td>
      </tr>
    );
  }

  scaleWidth(width, scaleMax, value) {
    return width * Math.abs(value) / scaleMax;
  }

  renderRow(key, item, maxTick) {
    return (
      <tr key={key}>
        <td style={{borderBottom: '1px solid #eee', borderTop: '1px solid #eee', borderRight: '1px solid #979797'}}>
          <this.props.label {...this.props.labelProps} index={key} item={item}/>
        </td>
        <td style={{borderBottom: '1px solid #eee', borderTop: '1px solid #eee', borderRight: '1px solid #979797'}}>
          {item.r < 0 &&
            <div style={{backgroundColor: '#d8d8d8', height: 37, width: this.scaleWidth(150, maxTick, item.r), float: 'right'}}>{item.r.toFixed(4)}</div>
          }
        </td>
        <td style={{border: '1px solid #eee', borderRight: '1px solid #979797'}}>
          {item.r > 0 &&
            <div style={{backgroundColor: '#d8d8d8', height: 37, width: this.scaleWidth(150, maxTick, item.r)}}>{item.r.toFixed(4)}</div>
          }
        </td>
        <td style={{borderBottom: '1px solid #eee', borderTop: '1px solid #eee', width: 10}}>
        </td>
      </tr>
    );
  }

  render() {
    const { items } = this.props;
    const maxTick = this.rangeMax(pluck(items, 'r'));
    console.log(items);

    return (
      <table style={{marginLeft: 15}}>
        <tbody>
        { isNaN(maxTick)
          ? this.renderTicks(-1, 1)
          : this.renderTicks(-maxTick, maxTick) }

        <tr key='top'>
          <td style={{borderRight: '1px solid #979797', height: 10, width: 450}}></td>
          <td style={{borderRight: '1px solid #979797', height: 10, width: 150}}></td>
          <td style={{borderRight: '1px solid #979797', height: 10, width: 150}}></td>
          <td></td>
        </tr>

        {items.map((item, i) => this.renderRow(i, item, maxTick))}

        <tr key='bottom'>
          <td style={{borderRight: '1px solid #979797', height: 10}}></td>
          <td style={{borderRight: '1px solid #979797', height: 10}}></td>
          <td style={{borderRight: '1px solid #979797', height: 10}}></td>
          <td></td>
        </tr>
        </tbody>
      </table>
    );
  }
}
