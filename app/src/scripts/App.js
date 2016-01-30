import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Navbar, NavBrand, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import AlertMessages from './components/AlertMessages';
import { logout, loginSuccess } from './state/auth';
import { JWT_KEY_NAME, NEUROVAULT_CLIENT_IDS } from './constants/auth';

export default class App extends React.Component {
  static propTypes = {
    children: PropTypes.object,
    auth: PropTypes.object,
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

  handleLogout(e) {
    e.preventDefault();
    localStorage.removeItem(JWT_KEY_NAME);
    this.props.dispatch(logout());
    this.context.router.transitionTo('/');
  }

  authLink() {
    const host = window.location.host;
    const clientId = NEUROVAULT_CLIENT_IDS[/^localhost\b/.test(host) ? 'development' : 'production'];
    const redirectUri = `${window.location.protocol}//${host}/signin/authorized`;
    return `http://neurovault.org/o/authorize/?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}`;
  }

  renderLoginLink() {
    return <NavItem href={this.authLink()}>Sign in with NeuroVault</NavItem>;
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
    const { auth, alertMessages } = this.props;
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
          <AlertMessages messages={alertMessages} />
          {this.props.children}
        </div>
      </div>
    );
  }
}

function select(state) {
  return state;
}

export default connect(select)(App);
