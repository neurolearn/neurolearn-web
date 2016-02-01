import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import MLModels from './dashboard/MLModels';
import LoggedOut from './LoggedOut';

export default class HomePage extends React.Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
    history: PropTypes.object
  }

  componentWillReceiveProps() {
    const { auth } = this.props;
    const { router, history } = this.context;

    if (auth.user) {
      router.push('/dashboard/models');
    }
  }

  render() {
    const { auth } = this.props;
    return auth.user ? <MLModels /> : <LoggedOut />;
  }
}

function select(state) {
  return state;
}

export default connect(select)(HomePage);
