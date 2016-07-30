/* @flow */

import React, { PropTypes } from 'react';
import { Alert } from 'react-bootstrap';

type Message = { message: string, level: string};

function mapLevelToStyle(level): string {
  if (level === 'error') {
    return 'danger';
  } else {
    return level;
  }
}

const AlertMessages = (
  { messages, dismissAlert } : { messages: Array<Message>, dismissAlert: Function}
) => (
  <div>
    {messages.map((message, index) =>
      <Alert key={index} bsStyle={mapLevelToStyle(message.level)} onDismiss={() => dismissAlert(message)}>
        {message.message}
      </Alert>
    )}
  </div>
);

AlertMessages.propTypes = {
  messages: PropTypes.array.isRequired,
  dismissAlert: PropTypes.func.isRequired
};

export default AlertMessages;
