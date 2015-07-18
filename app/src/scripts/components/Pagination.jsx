'use strict';

import React from 'react';
import { Pagination } from 'react-bootstrap';

export default class SearchPagination extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activePage: 1
    };
  }

  handleSelect(event, selectedEvent) {
    this.setState({
      activePage: selectedEvent.eventKey
    });
  }

  render() {
    return (
      <Pagination
        prev={true}
        next={true}
        first={true}
        last={true}
        ellipsis={true}
        items={20}
        maxButtons={5}
        activePage={this.state.activePage}
        onSelect={this.handleSelect} />
    );
  }
}

