'use strict';

import React from 'react';
import { Pagination } from 'react-bootstrap';

export default class SearchPagination extends React.Component {
  handleSelect(event, selectedEvent) {
    this.props.onSelect(selectedEvent.eventKey);
  }

  render() {
    return (
      <Pagination
        prev={true}
        next={true}
        first={true}
        last={true}
        ellipsis={true}
        items={this.props.totalPages}
        maxButtons={5}
        activePage={this.props.activePage}
        onSelect={this.handleSelect.bind(this)} />
    );
  }
}

