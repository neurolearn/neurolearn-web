import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import SearchContainer from './SearchContainer';

export default class SelectImagesModal extends React.Component {
  render() {
    return (
      <Modal {...this.props} bsSize='large' aria-labelledby='contained-modal-title-lg'>
        <Modal.Header closeButton>
          <Modal.Title id='contained-modal-title-lg'>Select Images from NeuroVault</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <SearchContainer />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
