/* @flow */

import React, { PropTypes } from 'react';
import ReactSlider from 'react-slider';

import styles from './RangeFilter.scss';

export default class RangeFilter extends React.Component {
  state: {
    value?: [number, number]
  };

  static propTypes = {
    label: React.PropTypes.string,
    min: React.PropTypes.number,
    max: React.PropTypes.number,
    value: React.PropTypes.arrayOf(React.PropTypes.number),
    onChange: PropTypes.func
  }

  constructor(props: Object) {
    super(props);
    this.state = {
      value: undefined
    };

    (this:any).handleClearFilterClick = this.handleClearFilterClick.bind(this);
    (this:any).handleInputChange = this.handleInputChange.bind(this);
    (this:any).handleSliderChange = this.handleSliderChange.bind(this);
    (this:any).handleSliderOnAfterChange = this.handleSliderOnAfterChange.bind(this);
  }

  triggerOnChange() {
    this.props.onChange(this.state.value);
  }

  handleInputChange() {
    this.setState({
      value: [
        this.refs.inputFrom.value,
        this.refs.inputTo.value
      ]
    }, this.triggerOnChange);
  }

  handleSliderChange(value: [number, number]) {
    this.setState({ value });
  }

  handleSliderOnAfterChange() {
    this.triggerOnChange();
  }

  handleClearFilterClick() {
    this.setState({value: undefined}, this.triggerOnChange);
  }

  render() {
    const { value } = this.state;
    const { max, min } = this.props;

    return (
      <div className={styles.root}>
        <label className={!value && 'empty-filter'}>{
          this.props.label
        }&nbsp;<i
          title="Clear Filter"
          className="clear-filter fa fa-times-circle"
          onClick={this.handleClearFilterClick}
               ></i></label>

        <div className="clearfix">
          <div className={styles.from}>
            <input
              type="text"
              className="form-control"
              value={value ? value[0] : ''}
              ref="inputFrom"
              onChange={this.handleInputChange} />
          </div>
          <span className={styles.sep}>—</span>
          <div className={styles.to}>
            <input
              type="text"
              className="form-control"
              ref="inputTo"
              value={value ? value[1] : ''}
              onChange={this.handleInputChange} />
          </div>
        </div>
        <div className={styles.stats}>
          <span className="min">{min}</span>
          <span className="max pull-right">{max}</span>
        </div>
        <ReactSlider
          min={min}
          max={max}
          value={value || [min, max]}
          orientation="horizontal"
          withBars
          onChange={this.handleSliderChange}
          onAfterChange={this.handleSliderOnAfterChange}
        />
      </div>
    );
  }
}
