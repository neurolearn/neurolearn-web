'use strict';

import request from 'superagent';

import React from 'react';
import SearchResults from './SearchResults';


export default class SelectCollection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: null
    };
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.onUserInput(
      this.refs.collectionIdInput.getDOMNode().value
    );
  }

  loadSearchResults() {
    request.get('/search')
      .type('json')
      .accept('json')
      .end(function(err, res) {
        console.log(res);
        this.setState({searchResults: res.body});
      }.bind(this));
  }

  componentDidMount() {
    this.loadSearchResults();
  }

  render() {
    return (
      <div className="row" style={{border: '1px solid gray'}}>
        <div className="col-md-3" style={{border: '1px solid gray'}}>
          <form className="form-inline" style={{marginBottom: 30}} onSubmit={this.handleSubmit.bind(this)}>
            <input
              type="text"
              className="form-control"
              ref="collectionIdInput"
              placeholder="Collection Id"
              autoFocus={true}
              onChange={this.handleInputChange}
              style={{marginRight: 10}}
            />
            <button type="submit" className="btn btn-default"> Select </button>
          </form>
        </div>
        <div className="col-md-9" style={{border: '1px solid gray'}}>
          <select ref="order-by">
              <option value="">Order by:</option>
              <option value="date-added">Date added</option>
              <option value="number-of-images">Number of images</option>
          </select>
          <SearchResults results={this.state.searchResults} />
        </div>
      </div>
    );
  }
}
