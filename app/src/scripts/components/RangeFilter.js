import React, { PropTypes } from 'react';
import ReactSlider from 'react-slider';

import styles from './RangeFilter.scss';

export default class RangeFilter extends React.Component {
  static propTypes = {
    label: React.PropTypes.string,
    valuesFrom: React.PropTypes.number,
    valuesTo: React.PropTypes.number,
    onChange: PropTypes.func
  }

  handleChange() {
    this.props.onChange(
      this.refs.inputFrom.getDOMNode().value,
      this.refs.inputTo.getDOMNode().value
    );
  }

  sliderOnChange(e) {
    console.log('slider onChange', e);
  }

  sliderOnAfterChange(e) {
    console.log('slider onAfterChange', e);
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
                  placeholder={this.props.valuesFrom}
                  ref='inputFrom'
                  onChange={this.handleChange.bind(this)} />
            </div>
            <span className={styles.sep}>—</span>
            <div className={styles.to}>
              <input
                  type='text'
                  className='form-control'
                  ref='inputTo'
                  placeholder={this.props.valuesTo}
                  onChange={this.handleChange.bind(this)} />
            </div>
        </div>
        <ReactSlider defaultValue={[0, 100]}
          orientation="horizontal"
          withBars={true}
          onChange={this.sliderOnChange.bind(this)}
          onAfterChange={this.sliderOnAfterChange.bind(this)}
          />
      </div>
    );
  }
}

