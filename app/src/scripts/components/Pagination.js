import React from 'react';
import { Pagination } from 'react-bootstrap';

export default class SearchPagination extends React.Component {
  handleSelect(event, selectedEvent) {
    this.props.onSelect(selectedEvent.eventKey);
  }

  maxButtons(totalPages) {
    return totalPages > 5 ? 5 : totalPages;
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
        maxButtons={this.maxButtons(this.props.totalPages)}
        activePage={this.props.activePage}
        onSelect={this.handleSelect.bind(this)} />
    );
  }
}

