'use strict';

import React from 'react';

export default class SelectCollection extends React.Component {
  handleSelectCollection() {
    this.props.onUserInput(
      this.refs.collectionIdInput.getDOMNode().value
    );
  }

  render() {
    return (
      <div className="selectCollection">
        <p>Select a NeuroVault collection:</p>
        <input
          type="text"
          ref="collectionIdInput"
          placeholder="Collection Id"
          autoFocus={true}
          onChange={this.handleInputChange}
        />
        <button onClick={this.handleSelectCollection.bind(this)}> Select </button>
      </div>
    );
  }
}
