import React, { PropTypes } from 'react';
import { Modal, Button } from 'react-bootstrap';

const ModalDialog = ({title, body, actionButton, onHide, bsSize}) => (
  <Modal bsSize={bsSize} show={true} onHide={onHide}>
    <Modal.Header closeButton>
      <Modal.Title>{title}</Modal.Title>
    </Modal.Header>
    <Modal.Body>{body}</Modal.Body>
    <Modal.Footer>
      {actionButton}
      <Button onClick={onHide}>Close</Button>
    </Modal.Footer>
  </Modal>
)

ModalDialog.propTypes = {
  onHide: PropTypes.func,
}

export default ModalDialog;
