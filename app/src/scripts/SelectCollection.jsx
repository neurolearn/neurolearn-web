'use strict';

import React from 'react';

export default class SelectCollection extends React.Component {
  handleSelectCollection() {
    alert('select collection');
  }

  render() {
    return (
      <div className="selectCollection">
        <p>Select a NeuroVault collection:</p>
        <input ref="nvCollectionId" placeholder="Collection Id" autoFocus={true} />
        <button onClick={this.handleSelectCollection}> Select </button>
        <div style={{width: '300px', height: '150px', border: '1px solid grey'}}>
        </div>
      </div>
    );
  }
}
