/* @flow */

import { pluck, round } from 'lodash';
import React, { PropTypes } from 'react';

import styles from './BarChartRowContainer.scss';

type ChartRow = {
  id: number,
  name: string,
  r: number,
  collectionName: string,
  collection_id: number,
  thumbnail: string
};

const AXIS_PIXEL_WIDTH = 100;

export default class BarChartRowContainer extends React.Component {
  static propTypes = {
    items: PropTypes.array.isRequired,
    labelProps: PropTypes.object,
    label: PropTypes.func.isRequired
  }

  absMax(array: number[]) {
    return Math.max.apply(null, array.map(Math.abs));
  }

  rangeMax(array: number[]) {
    const m = 10;
    const span = this.absMax(array);
    let step = Math.pow(10, Math.floor(Math.log(span / m) / Math.LN10));
    let err = m / span * step;

    if (err <= 0.15) {
      step *= 10;
    } else if (err <= 0.35) {
      step *= 5;
    } else if (err <= 0.75) {
      step *= 2;
    }
    return Math.floor(span / step) * step + step * 0.5;
  }

  scaleWidth(width: number, scaleMax: number, value: number) {
    return width * Math.abs(value) / scaleMax;
  }

  renderRow(key: number, item: ChartRow, bound: number) {
    const r = round(item.r, 2);
    const maxTick = isNaN(bound) ? 1 : bound;

    return (
      <tr key={key}>
        <td className="image-label">
          <this.props.label {...this.props.labelProps} index={key} item={item} />
        </td>
        <td className="chart-cell low-chart" style={{minWidth: AXIS_PIXEL_WIDTH}}>
          {key === 0 && <div className="tick pull-left">{parseFloat(-maxTick)}</div>}
          {r < 0 && [
            <div
              className="bar-chart bar-negative"
              style={{width: this.scaleWidth(AXIS_PIXEL_WIDTH, maxTick, r)}}
            />,
            <div className="bar-label bar-label-negative">{r}</div>
          ]}
        </td>
        <td className="chart-cell high-chart" style={{minWidth: AXIS_PIXEL_WIDTH}}>
          {key === 0 && <div className="tick pull-right">{parseFloat(maxTick)}</div>}
          {r >= 0 && [
            <div
              className="bar-chart bar-positive"
              style={{width: this.scaleWidth(AXIS_PIXEL_WIDTH, maxTick, r)}}
            />,
            <div className="bar-label bar-label-positive">{r}</div>
          ]}
        </td>
      </tr>
    );
  }

  render() {
    const { items } = this.props;
    const bound = round(this.rangeMax(pluck(items, 'r')), 2);

    return (
      <table className={styles.root}>
        <tbody>
          {items.map((item, i) => this.renderRow(i, item, bound))}
        </tbody>
      </table>
    );
  }
}
