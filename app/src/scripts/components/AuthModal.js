import React, { PropTypes } from 'react';
import { Modal, Button, Input, Alert } from 'react-bootstrap';


export default class SelectImagesModal extends React.Component {
  static propTypes = {
    auth: PropTypes.object.isRequired,
    onHide: PropTypes.func.isRequired,
    onLogin: PropTypes.func.isRequired
  }

  handleSubmit() {
    const email = this.refs.email.getValue(),
      password = this.refs.password.getValue();
    this.props.onLogin(email, password);
  }

  errorProps(fieldName, loginError) {
    if (!(loginError
      && loginError.fields
      && loginError.fields[fieldName])) {
      return {};
    }

    return {
      bsStyle: 'error',
      help: loginError.fields[fieldName][0]
    };
  }

  render() {
    const { auth } = this.props;
    const { loginError } = auth;
    return (
      <Modal {...this.props} aria-labelledby='contained-modal-title-lg'>
        <Modal.Header closeButton>
          <Modal.Title id='contained-modal-title-lg'>Log In</Modal.Title>
        </Modal.Header>
        <Modal.Body>
         { loginError && loginError.message &&
          <Alert bsStyle='danger'>{auth.loginError.message}</Alert>
         }
          <form onSubmit={this.handleSubmit.bind(this)}>
            <Input {...this.errorProps('email', loginError)}
                   type='email'
                   ref='email'
                   label='Email Address' />
            <Input {...this.errorProps('password', loginError)}
                   type='password'
                   ref='password'
                   label='Password' />
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button bsStyle="primary" onClick={this.handleSubmit.bind(this)}>Log In</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
