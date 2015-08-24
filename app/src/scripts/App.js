import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Navbar, Nav, NavItem, DropdownButton, MenuItem } from 'react-bootstrap';
import AuthModal from './components/AuthModal';
import { showAuthModal, hideAuthModal } from './state/authModal';
import { login, logout, loginSuccess } from './state/auth';
import { JWT_KEY_NAME } from './constants/auth';

export default class App extends React.Component {
  static propTypes = {
    children: PropTypes.object,
    auth: PropTypes.object,
    authModal: PropTypes.object,
    dispatch: PropTypes.func.isRequired
  };

  componentDidMount() {
    const jwt = localStorage.getItem(JWT_KEY_NAME);
    if (jwt) {
      this.props.dispatch(loginSuccess(jwt));
    }
  }

  handleShowAuthModal(e) {
    e.preventDefault();
    this.props.dispatch(showAuthModal());
  }

  handleLogin(email, password) {
    this.props.dispatch(login(email, password));
  }

  handleLogout(e) {
    e.preventDefault();
    localStorage.removeItem(JWT_KEY_NAME);
    this.props.dispatch(logout());
  }

  renderLoginLink() {
    return <NavItem onClick={this.handleShowAuthModal.bind(this)} href='#'>Log In</NavItem>;
  }

  renderUserDropdown(user) {
    return (
      <DropdownButton eventKey={1} title={user.email}>
        <MenuItem eventKey='1' onClick={this.handleLogout.bind(this)}>Logout</MenuItem>
      </DropdownButton>
    );
  }

  render () {
    const { auth, dispatch } = this.props;
    return (
      <div>
        <Navbar fluid brand={<a href="#">Neurolearn</a>}>
          <Nav navbar>
            <NavItem eventKey={0} href='#'>Train Model</NavItem>
          </Nav>
          <Nav navbar right>
            { auth.user
              ? this.renderUserDropdown(auth.user)
              : this.renderLoginLink() }
          </Nav>
        </Navbar>

        <div className="appcontent">
          {this.props.children}
        </div>
        <AuthModal auth={auth}
                   show={this.props.authModal.display}
                   onLogin={this.handleLogin.bind(this)}
                   onHide={() => dispatch(hideAuthModal())} />
      </div>
    );
  }
}

function select(state) {
  return state;
}

export default connect(select)(App);
