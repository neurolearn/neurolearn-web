'use strict';

import React from 'react';

var RunAnalysisForm = React.createClass({
    handleRun: function() {
        this.props.onRunAnalysis();
    },
    render: function() {
        console.log(this);
        return (
          <button onClick={this.handleRun}>Run Analysis</button>
        );
    }
});

export default RunAnalysisForm;
