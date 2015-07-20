import React, { PropTypes } from 'react';
import { Input } from 'react-bootstrap';

import styles from './TermsFilter.scss';

export default class TermsFilter extends React.Component {
  static propTypes = {
    label: PropTypes.string,
    terms: PropTypes.array,
    onChange: PropTypes.func,
    disabled: PropTypes.bool
  }

  handleChange() {
    this.props.onChange(
      this.refs.inputFrom.getDOMNode().value,
      this.refs.inputTo.getDOMNode().value
    );
  }

  renderCheckboxes(terms, disabled) {
    return terms.map(term =>
      <Input type='checkbox' disabled={disabled} label={`${term.key} (${term.doc_count})`} key={term.key} />
    );
  }

  render() {
    const { label, terms, disabled } = this.props;

    return (
      <div className={styles.root}>
        <label className="control-label">{label}</label>
        { this.renderCheckboxes(terms, disabled) }
      </div>
    );
  }
}

