import React, { PropTypes } from 'react';
import classNames from 'classnames';

import styles from './SearchInput.scss';

export default class SearchInput extends React.Component {
  static propTypes = {
    value: PropTypes.string,
    placeholder: PropTypes.string,
    onChange: PropTypes.func.isRequired
  }

  handleChange() {
    this.props.onChange(this.refs.input.value);
  }

  handleClearSearchClick() {
    this.props.onChange('');
  }

  render() {
    const { value } = this.props;

    return (
      <div className={styles.root}>
        <label htmlFor="search-input"><i className="fa fa-search"></i></label>
        <input
          id="search-input"
          ref="input"
          className="form-control input-lg"
          autoComplete="off"
          spellCheck="false"
          autocorrect="off"
          value={this.props.value}
          placeholder={this.props.placeholder}
          onChange={this.handleChange.bind(this)}
        />
        <span
          className={classNames('clear-search fa fa-times-circle', value === '' && 'hide')}
          onClick={this.handleClearSearchClick.bind(this)}
        ></span>
      </div>
    );
  }
}
