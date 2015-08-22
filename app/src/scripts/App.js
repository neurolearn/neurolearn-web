import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import AuthModal from './components/AuthModal';
import { showAuthModal, hideAuthModal } from './state/authModal';
import { login } from './state/auth';

export default class App extends React.Component {
  static propTypes = {
    children: PropTypes.object,
    auth: PropTypes.object,
    dispatch: PropTypes.func.isRequired
  };

  handleShowAuthModal(e) {
    e.preventDefault();
    this.props.dispatch(showAuthModal());
  }

  handleLogin(email, password) {
    console.log(email, password);
    this.props.dispatch(login(email, password));
  }

  handleLogOut(e) {
    e.preventDefault();
  }

  render () {
    const { auth, dispatch } = this.props;
    return (
      <div>
        <nav className="navbar navbar-default navbar-static-top">
          <div className="container-fluid">
            <div className="navbar-header">
              <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </button>
              <a className="navbar-brand" href="#">Neurolearn</a>
            </div>
            <div id="navbar" className="navbar-collapse collapse">
              <ul className="nav navbar-nav">
                <li className="active"><a id="navLinkHome"href="#">Train Model</a></li>
              </ul>
              <ul className="nav navbar-nav navbar-right navbar-user">
                {!auth.user && <li><a href="#" onClick={this.handleShowAuthModal.bind(this)}>Log In</a></li>}
                {auth.user && <li><a href="#" onClick={this.handleLogout.bind(this)}>Logout</a></li>}
              </ul>
            </div>
          </div>
        </nav>
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
