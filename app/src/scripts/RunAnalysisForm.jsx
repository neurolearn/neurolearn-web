'use strict';

import React from 'react';

var RunAnalysisForm = React.createClass({
    handleRun: function() {
        this.props.onRunAnalysis();
    },
    render: function() {
        return (
          <button className="btn btn-primary" onClick={this.handleRun}>Run Analysis</button>
        );
    }
});

export default RunAnalysisForm;
