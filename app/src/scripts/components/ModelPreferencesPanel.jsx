'use strict';

import React from 'react';

export default class ModelPreferencesPanel extends React.Component {
  render() {
    return (
      <div className="panel panel-default">
        <div className="panel-heading">
          <h3 className="panel-title">Model Preferences</h3>
        </div>
        <div className="panel-body">
          <p>Search NeuroVault's collections and select images to create a training dataset.</p>

        </div>
      </div>
    );
  }
}
