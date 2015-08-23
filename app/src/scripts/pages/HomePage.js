import React from 'react';
import { connect } from 'react-redux';
import LoggedOut from './LoggedOut';
import Dashboard from './Dashboard';

export default class HomePage extends React.Component {
  render() {
    const { auth } = this.props;
    return auth.user ? <Dashboard /> : <LoggedOut />;
  }
}

function select(state) {
  return state;
}

export default connect(select)(HomePage);
