import React, { PropTypes } from 'react';
import { Alert } from 'react-bootstrap';

function mapLevelToStyle(level) {
  if (level === 'error') {
    return 'danger';
  } else {
    return level;
  }
}

export default class AlertMessages extends React.Component {
  static propTypes = {
    messages: PropTypes.array.isRequired
  }

  handleAlertDismiss() {
    console.log('dismiss');
  }

  render() {
    const { messages } = this.props;

    return (
      <div>
        {messages.map((message, index) =>
          <Alert key={index} bsStyle={mapLevelToStyle(message.level)} onDismiss={this.handleAlertDismiss}>
            {message.message}
          </Alert>
        )}
      </div>
    );
  }
}
