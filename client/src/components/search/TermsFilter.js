/* @flow */

import React, { PropTypes } from 'react';
import classNames from 'classnames';
import { some, omit, sortBy } from 'lodash';

import { Checkbox } from 'react-bootstrap';

import Events from '../../utils/events';

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

  constructor(props: Object) {
    super(props);
    (this:any).handleClearFilterClick = this.handleClearFilterClick.bind(this);
  }

  handleChange(key: string, e: SyntheticEvent) {
    const { terms } = this.props;

    const newTerms = terms.map(term =>
      term.key === key
      ? Object.assign({}, term, {selected: Events.target(e, HTMLInputElement).checked})
      : term
    );

    this.props.onChange(newTerms);
  }

  handleClearFilterClick() {
    this.props.onChange(clearSelected(this.props.terms));
  }

  renderCheckboxes(terms: Array<{}>, disabled: boolean) {
    return sortBy(terms, 'key').map(term =>
      <Checkbox
        disabled={disabled}
        checked={term.selected}
        key={term.key}
        onChange={(e) => this.handleChange(term.key, e)}
      >
        {`${term.key} (${term.doc_count})`}
      </Checkbox>
    );
  }

  render() {
    const { label, terms, disabled } = this.props;
    return (
      <div className={styles.root}>
        <label
          className={classNames('control-label',
                                !anySelected(terms) && 'empty-filter')}
        >{label}&nbsp;<i
          title="Clear Filter"
          className="clear-filter fa fa-times-circle"
          onClick={this.handleClearFilterClick}
        ></i>
        </label>
        {this.renderCheckboxes(terms, disabled)}
      </div>
    );
  }
}

