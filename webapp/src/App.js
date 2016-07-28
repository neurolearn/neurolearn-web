/* @flow */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';
import { bindActionCreators } from 'redux';
import { Navbar, NavBrand, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import AlertMessages from './components/AlertMessages';
import { logout } from './state/auth';
import { dismissAlert } from './state/alertMessages';
import { JWT_KEY_NAME } from './constants/auth';
import { authLink } from './utils';

import './styles/core.scss';

const logoBetaStyle = {
  fontStyle: 'italic',
  color: '#A2A2A2',
  marginLeft: 2,
  fontFamily: 'Georgia, serif'
};

class App extends React.Component {
  static propTypes = {
    children: PropTypes.object,
    auth: PropTypes.object,
    alertMessages: PropTypes.array,
    dispatch: PropTypes.func.isRequired
  };

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  constructor() {
    super();
    this.handleLogout = this.handleLogout.bind(this);
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
    const { auth, alertMessages, dispatch } = this.props;
    const { router } = this.context;

    return (
      <div>
        <Navbar staticTop>
          <NavBrand><Link to="/">Neurolearn<sup style={logoBetaStyle}>beta</sup></Link></NavBrand>
          {auth.user && this.renderAuthenticatedNav()}
          <Nav>
            <LinkContainer to="/explore">
              <NavItem eventKey={1} active={router.isActive('/explore')}>Explore</NavItem>
            </LinkContainer>
            <LinkContainer to="/faq">
              <NavItem eventKey={1} active={router.isActive('/faq')}>FAQ</NavItem>
            </LinkContainer>
          </Nav>
          <Nav right>
            {auth.user
              ? this.renderUserDropdown(auth.user)
              : this.renderLoginLink()}
          </Nav>
        </Navbar>

        <div className="container" style={{marginBottom: 50}}>
          <AlertMessages messages={alertMessages}
            {...bindActionCreators({dismissAlert}, dispatch)} />
          {this.props.children}
        </div>
        <div style={{position: 'fixed', bottom: 20, right: 20, zIndex: 1000}}>
          <a
            style={{borderRadius: '999rem'}}
            className="btn btn-success"
            target="_blank"
            href="https://github.com/neurolearn/neurolearn-web/issues"><i className="fa fa-comment-o" aria-hidden="true"></i> Send feedback</a>
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

function select(state) {
  return state;
}

export default connect(select)(App);
