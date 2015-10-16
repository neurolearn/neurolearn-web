
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

  handleChange(key, e) {
    const { terms } = this.props;

    const newTerms = terms.map(term =>
      term.key === key
      ? Object.assign({}, term, {selected: e.target.checked})
      : term
    );

    this.props.onChange(newTerms);
  }

  renderCheckboxes(terms, disabled) {
    return terms.map(term =>
      <Input
        type='checkbox'
        disabled={disabled}
        checked={term.selected}
        label={`${term.key} (${term.doc_count})`}
        key={term.key}
        onChange={(e) => this.handleChange(term.key, e)}
      />
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

