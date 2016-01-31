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
    messages: PropTypes.array.isRequired,
    dismissAlert: PropTypes.func
  }

  render() {
    const { messages, dismissAlert } = this.props;

    return (
      <div>
        {messages.map((message, index) =>
          <Alert key={index} bsStyle={mapLevelToStyle(message.level)} onDismiss={() => dismissAlert(message)}>
            {message.message}
          </Alert>
        )}
      </div>
    );
  }
}
