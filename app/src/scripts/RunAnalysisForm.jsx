'use strict';

import React from 'react';

var RunAnalysisForm = React.createClass({
    handleSubmit: function(e) {
      e.preventDefault();
      this.props.onRunAnalysis(
        this.refs.algorithmInput.getDOMNode().value
      );
    },
    render: function() {
        return (
          <div className="RunAnalysisForm">
            <form className="form-inline" onSubmit={this.handleSubmit.bind(this)}>
              <div className="form-group">
                <p>Select the type of algorithm.</p>
                <select className="form-control" ref="algorithmInput" style={{marginRight: 10}}>
                  <option value="">Algorithm</option>
                  <option value="svm">svm</option>
                  <option value="svr">svr</option>
                  <option value="ridge">ridge</option>
                </select>
                <button type="submit" className="btn btn-primary">Run Analysis</button>
              </div>
            </form>
          </div>
        );
    }
});

export default RunAnalysisForm;
