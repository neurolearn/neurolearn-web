import React, { PropTypes } from 'react';
import ReactSlider from 'react-slider';

import styles from './RangeFilter.scss';

const RANGE_MIN = 0;
const RANGE_MAX = 100;

export default class RangeFilter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null
    };
  }

  static propTypes = {
    label: React.PropTypes.string,
    value: React.PropTypes.arrayOf(React.PropTypes.number),
    onChange: PropTypes.func
  }

  triggerOnChange() {
    this.props.onChange(this.state.value);
  }

  inputOnChange() {
    this.setState({
      value: [
        this.refs.inputFrom.getDOMNode().value,
        this.refs.inputTo.getDOMNode().value
      ]
    }, this.triggerOnChange);
  }

  sliderOnChange(e) {
    this.setState({value: e});
  }

  sliderOnAfterChange() {
    this.triggerOnChange();
  }

  render() {
    return (
      <div className={styles.root}>
        <label>{this.props.label}</label>

        <div className="clearfix">
            <div className={styles.from}>
              <input
                  type='text'
                  className='form-control'
                  value={this.state.value ? this.state.value[0] : ''}
                  ref='inputFrom'
                  onChange={this.inputOnChange.bind(this)} />
            </div>
            <span className={styles.sep}>—</span>
            <div className={styles.to}>
              <input
                  type='text'
                  className='form-control'
                  ref='inputTo'
                  value={this.state.value ? this.state.value[1] : ''}
                  onChange={this.inputOnChange.bind(this)} />
            </div>
        </div>
        <div className="stats">
          <span className="min">{ RANGE_MIN }</span>
          <span className="max pull-right">{ RANGE_MAX }</span>
        </div>
        <ReactSlider
          min={RANGE_MIN}
          max={RANGE_MAX}
          value={this.state.value ? this.state.value : [RANGE_MIN, RANGE_MAX]}
          orientation="horizontal"
          withBars
          onChange={this.sliderOnChange.bind(this)}
          onAfterChange={this.sliderOnAfterChange.bind(this)}
          />
      </div>
    );
  }
}

