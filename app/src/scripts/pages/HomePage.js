import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import LoggedOut from './LoggedOut';
import Dashboard from './Dashboard';

export default class HomePage extends React.Component {
  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  componentDidMount() {
    const { auth } = this.props;
    const { router } = this.context;

    if (auth.user) {
      router.transitionTo('/models');
    }
  }
  render() {
    const { auth } = this.props;
    return auth.user ? <Dashboard /> : <LoggedOut />;
  }
}

function select(state) {
  return state;
}

export default connect(select)(HomePage);
