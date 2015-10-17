import React, { PropTypes } from 'react';
import classNames from 'classnames';
import { some, omit, sortBy } from 'lodash';

import { Input } from 'react-bootstrap';

import styles from './TermsFilter.scss';

function anySelected(terms) {
  return some(terms, 'selected');
}

function clearSelected(terms) {
  return terms.map(term => omit(term, 'selected'));
}

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

  handleClearFilterClick() {
    this.props.onChange(clearSelected(this.props.terms));
  }

  renderCheckboxes(terms, disabled) {
    return sortBy(terms, 'key').map(term =>
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
        <label
          className={classNames('control-label',
                                !anySelected(terms) && 'empty-filter')}
        >{label}&nbsp;<i title="Clear Filter"
                         className="clear-filter fa fa-times-circle"
                         onClick={this.handleClearFilterClick.bind(this)}
                      ></i>
        </label>
        { this.renderCheckboxes(terms, disabled) }
      </div>
    );
  }
}

