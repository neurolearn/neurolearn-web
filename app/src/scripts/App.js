import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Navbar, NavBrand, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
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

  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  componentWillMount() {
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
    this.context.router.transitionTo('/');
  }

  authLink() {
    const clientId = 'q5avszwASkC3WNywlGOgQYgiztNStiLbdy80izw8';
    const redirectUri = 'http%3A%2F%2Flocalhost%3A3000%2Fsignin%2Fauthorized';
    return `http://neurovault.org/o/authorize/?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}`;
  }

  renderLoginLink() {
    return [<NavItem onClick={this.handleShowAuthModal.bind(this)} href='#'>Log In</NavItem>,
            <NavItem href={this.authLink()}>Sign in with NeuroVault</NavItem>];
  }

  renderUserDropdown(user) {
    return (
      <NavDropdown id="user-account-dropdown" eventKey={1} title={user.name}>
        <MenuItem
          eventKey='1'
          onSelect={this.handleLogout.bind(this)}
        >Logout</MenuItem>
      </NavDropdown>
    );
  }

  renderAuthenticatedNav() {
    const { router } = this.context;
    return (
      <Nav>
        <NavItem eventKey={0}
                 active={router.isActive('/dashboard')}
                 href='#/'>Dashboard</NavItem>
      </Nav>
    );
  }

  render () {
    const { auth, dispatch } = this.props;
    const { router } = this.context;

    return (
      <div>
        <Navbar staticTop>
          <NavBrand><a href="#">Neurolearn</a></NavBrand>
          { auth.user && this.renderAuthenticatedNav() }
          <Nav>
            <NavItem eventKey={1} active={router.isActive('/explore')} href='#/explore'>Explore</NavItem>
          </Nav>
          <Nav right>
            { auth.user
              ? this.renderUserDropdown(auth.user)
              : this.renderLoginLink() }
          </Nav>
        </Navbar>

        <div className="container">
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
