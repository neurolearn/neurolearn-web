import React, { PropTypes } from 'react';
import { Input } from 'react-bootstrap';

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

  render() {
    return (
      <div className="clearfix">
          <label>{this.props.label}</label>
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
    );
  }
}

