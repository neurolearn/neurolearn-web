/* @flow */

import React, { PropTypes } from 'react';
import { Modal, Button } from 'react-bootstrap';

const ModalDialog = (
  { title, body, actionButton, onHide, bsSize }
: { title: string,
    body: React$Element<any>,
    actionButton?: React$Element<any>,
    onHide: () => void,
    bsSize?: string }
) => (
  <Modal bsSize={bsSize} show onHide={onHide}>
    <Modal.Header closeButton>
      <Modal.Title>{title}</Modal.Title>
    </Modal.Header>
    <Modal.Body>{body}</Modal.Body>
    <Modal.Footer>
      {actionButton}
      <Button onClick={onHide}>Close</Button>
    </Modal.Footer>
  </Modal>
);

ModalDialog.propTypes = {
  title: PropTypes.string,
  body: PropTypes.node,
  actionButton: PropTypes.node,
  onHide: PropTypes.func,
  bsSize: PropTypes.string
};

export default ModalDialog;
