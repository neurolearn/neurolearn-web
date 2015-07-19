import React, { PropTypes } from 'react';
import { Input, Row, Col } from 'react-bootstrap';

import styles from './RangeFilter.scss';

export default class RefineSearchResults extends React.Component {
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

  renderBuckets(buckets) {
    return buckets.map(bucket => <div>{bucket.key}: {bucket.doc_count}</div>);
  }

  render() {
    return (
      <Input label={this.props.label} wrapperClassName='wrapper'>
        <div className="clearfix">
          <div className={styles.from}>
            <input
                type='text'
                className='form-control'
                placeholder={this.props.valuesFrom}
                ref='inputFrom'
                onChange={this.handleChange.bind(this)} />
          </div>
          <div className={styles.to}>
            <input
                type='text'
                className='form-control'
                ref='inputTo'
                placeholder={this.props.valuesTo}
                onChange={this.handleChange.bind(this)} />
          </div>
        </div>
      </Input>
    );
  }
}

