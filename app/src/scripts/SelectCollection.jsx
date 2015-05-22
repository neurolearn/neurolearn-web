'use strict';

import React from 'react';

export default class SelectCollection extends React.Component {
  handleSubmit(e) {
    e.preventDefault();
    this.props.onUserInput(
      this.refs.collectionIdInput.getDOMNode().value
    );
  }

  render() {
    return (
      <form className="form-inline" style={{marginBottom: 30}} onSubmit={this.handleSubmit.bind(this)}>
        <p>Select a NeuroVault collection</p>
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
    );
  }
}
