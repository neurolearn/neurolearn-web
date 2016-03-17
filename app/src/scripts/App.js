import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router'
import { LinkContainer } from 'react-router-bootstrap'
import { bindActionCreators } from 'redux';
import { Navbar, NavBrand, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import AlertMessages from './components/AlertMessages';
import { logout, loginSuccess } from './state/auth';
import { dismissAlert } from './state/alertMessages';
import { JWT_KEY_NAME, NEUROVAULT_DEV_CLIENT_ID } from './constants/auth';
import { fetchAuthenticatedUser } from './state/auth';

function nvAuthLink(loc) {
    const { protocol, host } = loc;
    const redirectUri = `${protocol}//${host}/signin/authorized`;
    return `http://neurovault.org/o/authorize/?response_type=code&client_id=${NEUROVAULT_DEV_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}`;
}

function authLink(loc) {
    const { host }= loc;
    return /^localhost\b/.test(host)
      ? nvAuthLink(host)
      : '/signin';
}

export default class App extends React.Component {
  static propTypes = {
    children: PropTypes.object,
    auth: PropTypes.object,
    alertMessages: PropTypes.array,
    dispatch: PropTypes.func.isRequired
  };

  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  handleLogout(e) {
    e.preventDefault();
    localStorage.removeItem(JWT_KEY_NAME);
    this.props.dispatch(logout());
    this.context.router.push('/');
  }

  renderLoginLink() {
    return <NavItem href={authLink(window.location)}>Sign in with NeuroVault</NavItem>;
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
        <LinkContainer to="/dashboard" active={router.isActive('/dashboard')}>
          <NavItem eventKey={0}>Dashboard</NavItem>
        </LinkContainer>
      </Nav>
    );
  }

  renderApp () {
    const { auth, alertMessages, dispatch } = this.props;
    const { router } = this.context;

    return (
      <div>
        <Navbar staticTop>
          <NavBrand><Link to="/">Neurolearn</Link></NavBrand>
          { auth.user && this.renderAuthenticatedNav() }
          <Nav>
            <LinkContainer to="/explore">
              <NavItem eventKey={1} active={router.isActive('/explore')}>Explore</NavItem>
            </LinkContainer>
            <LinkContainer to="/faq">
              <NavItem eventKey={1} active={router.isActive('/faq')}>FAQ</NavItem>
            </LinkContainer>
          </Nav>
          <Nav right>
            { auth.user
              ? this.renderUserDropdown(auth.user)
              : this.renderLoginLink() }
          </Nav>
        </Navbar>

        <div className="container">
          <AlertMessages messages={alertMessages}
                         {...bindActionCreators({dismissAlert}, dispatch)} />
          {this.props.children}
        </div>
      </div>
    );
  }

  render () {
    const { auth, alertMessages, dispatch } = this.props;
    const { router } = this.context;

    return auth.isFetching
      ? false
      : this.renderApp();
  }
}

function select(state) {
  return state;
}

export default connect(select)(App);
