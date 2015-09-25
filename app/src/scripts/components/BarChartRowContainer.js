import { pluck, round } from 'lodash';
import React, { PropTypes } from 'react';

const AXIS_PIXEL_WIDTH = 100;

export default class BarChartRowContainer extends React.Component {
  static propTypes = {
    items: PropTypes.array.isRequired,
    labelProps: PropTypes.object,
    label: PropTypes.func.isRequired
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
        <td><span>{parseFloat(lower)}</span></td>
        <td><span>0</span></td>
        <td><span>{parseFloat(higher)}</span></td>
      </tr>
    );
  }

  scaleWidth(width, scaleMax, value) {
    return width * Math.abs(value) / scaleMax;
  }

  renderRow(key, item, scaleMax) {
    const r = round(item.r, 2);

    return (
      <tr key={key}>
        <td style={{borderBottom: '1px solid #eee', borderTop: '1px solid #eee', borderRight: '1px solid #979797'}}>
          <this.props.label {...this.props.labelProps} index={key} item={item}/>
        </td>
        <td style={{borderBottom: '1px solid #eee', borderTop: '1px solid #eee', borderRight: '1px solid #979797'}}>
          {r < 0 &&
            <div style={{backgroundColor: '#d8d8d8', height: 37, width: this.scaleWidth(AXIS_PIXEL_WIDTH, scaleMax, r), float: 'right'}}>{r}</div>
          }
        </td>
        <td style={{border: '1px solid #eee', borderRight: '1px solid #979797'}}>
          {r > 0 &&
            <div style={{backgroundColor: '#d8d8d8', height: 37, width: this.scaleWidth(AXIS_PIXEL_WIDTH, scaleMax, r)}}>{r}</div>
          }
        </td>
        <td style={{borderBottom: '1px solid #eee', borderTop: '1px solid #eee', width: 10}}>
        </td>
      </tr>
    );
  }

  render() {
    const { items } = this.props;
    const scaleMax = round(this.rangeMax(pluck(items, 'r')), 2);

    return (
      <table>
        <tbody>
        { isNaN(scaleMax)
          ? this.renderTicks(-1, 1)
          : this.renderTicks(-scaleMax, scaleMax) }

        <tr key='top'>
          <td style={{borderRight: '1px solid #979797', height: 10, width: '90%'}}></td>
          <td style={{borderRight: '1px solid #979797', height: 10, minWidth: AXIS_PIXEL_WIDTH}}></td>
          <td style={{borderRight: '1px solid #979797', height: 10, minWidth: AXIS_PIXEL_WIDTH}}></td>
          <td></td>
        </tr>

        {items.map((item, i) => this.renderRow(i, item, scaleMax))}

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
