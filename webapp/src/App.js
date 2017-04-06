/* @flow */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import AlertMessages from './components/AlertMessages';
import { logout } from './state/auth';
import { dismissAlert } from './state/alertMessages';
import { JWT_KEY_NAME } from './constants/auth';
import { authLink } from './utils';

import 'core.scss';

class App extends React.Component {
  static propTypes = {
    children: PropTypes.object,
    auth: PropTypes.object,
    alertMessages: PropTypes.array,
    dismissAlert: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired
  };

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  constructor() {
    super();
    (this:any).handleLogout = this.handleLogout.bind(this);
  }

  handleLogout(e) {
    e.preventDefault();
    localStorage.removeItem(JWT_KEY_NAME);
    this.props.logout();
    this.context.router.push('/');
  }

  renderLoginLink() {
    return <NavItem href={authLink(window.location)}>Sign in with NeuroVault</NavItem>;
  }

  renderUserDropdown(user) {
    return (
      <NavDropdown id="user-account-dropdown" eventKey={1} title={user.name}>
        <MenuItem
          eventKey="1"
          onSelect={this.handleLogout}
        >Logout</MenuItem>
      </NavDropdown>
    );
  }

  renderAuthenticatedNav() {
    const { router } = this.context;
    return (
      <Nav>
        <LinkContainer to="/dashboard" active={router.isActive('/dashboard')}>
          <NavItem eventKey={0}>Dashboard</NavItem>
        </LinkContainer>
      </Nav>
    );
  }

  renderApp() {
    const { auth, alertMessages, dismissAlert } = this.props;
    const { router } = this.context;

    return (
      <div className={router.isActive('/') ? 'app-homepage' : ''}>
        <Navbar staticTop>
          <Navbar.Header>
            <Navbar.Brand>
              <Link to="/">Neurolearn<sup className="logo-beta">beta</sup></Link>
            </Navbar.Brand>
          </Navbar.Header>
          {auth.user && this.renderAuthenticatedNav()}
          <Nav>
            <LinkContainer to="/explore">
              <NavItem eventKey={1} active={router.isActive('/explore')}>Explore</NavItem>
            </LinkContainer>
            <LinkContainer to="/faq">
              <NavItem eventKey={1} active={router.isActive('/faq')}>FAQ</NavItem>
            </LinkContainer>
          </Nav>
          <Nav pullRight>
            {auth.user
              ? this.renderUserDropdown(auth.user)
              : this.renderLoginLink()}
          </Nav>
        </Navbar>

        <div>
          <AlertMessages messages={alertMessages} dismissAlert={dismissAlert} />
          {this.props.children}
        </div>

        <div className="feedback-button">
          <a
            className="btn btn-success"
            target="_blank"
            href="https://github.com/neurolearn/neurolearn-web/issues"
          >
            <i className="fa fa-comment-o" aria-hidden="true"></i> Send feedback
          </a>
        </div>
      </div>
    );
  }

  render() {
    const { auth } = this.props;

    return auth.isFetching
      ? null
      : this.renderApp();
  }
}

export default connect(state => state, { logout, dismissAlert })(App);
