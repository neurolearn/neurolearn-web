/* @flow */

import React, { PropTypes } from 'react';
import { Pagination } from 'react-bootstrap';

export default class SearchPagination extends React.Component {
  static propTypes = {
    activePage: PropTypes.number,
    totalPages: PropTypes.number,
    onSelect: PropTypes.func.isRequired
  }

  constructor(props: Object) {
    super(props);
    (this:any).handleSelect = this.handleSelect.bind(this);
  }

  handleSelect(eventKey: number) {
    this.props.onSelect(eventKey);
  }

  maxButtons(totalPages: number) {
    return totalPages > 5 ? 5 : totalPages;
  }

  render() {
    return (
      <Pagination
        prev
        next
        first
        last
        ellipsis
        items={this.props.totalPages}
        maxButtons={this.maxButtons(this.props.totalPages)}
        activePage={this.props.activePage}
        onSelect={this.handleSelect}
      />
    );
  }
}

