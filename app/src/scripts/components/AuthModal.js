import React, { PropTypes } from 'react';
import { Modal, Button, ButtonInput, Input, Alert } from 'react-bootstrap';


export default class SelectImagesModal extends React.Component {
  static propTypes = {
    auth: PropTypes.object.isRequired,
    onHide: PropTypes.func.isRequired,
    onLogin: PropTypes.func.isRequired
  }

  handleSubmit(e) {
    e.preventDefault();
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
        <form onSubmit={this.handleSubmit.bind(this)}>
          <Modal.Body>
           { loginError && loginError.message &&
            <Alert bsStyle='danger'>{auth.loginError.message}</Alert>
           }
              <Input {...this.errorProps('email', loginError)}
                     type='email'
                     ref='email'
                     label='Email Address' />
              <Input {...this.errorProps('password', loginError)}
                     type='password'
                     ref='password'
                     label='Password' />
          </Modal.Body>
          <Modal.Footer>
            <ButtonInput bsStyle="primary" type='submit' value='Log In' />
          </Modal.Footer>
        </form>
      </Modal>
    );
  }
}
