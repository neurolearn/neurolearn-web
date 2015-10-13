import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import LoggedOut from './LoggedOut';
import MLModels from './MLModels';

export default class HomePage extends React.Component {
  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  componentWillReceiveProps() {
    const { auth } = this.props;
    const { router } = this.context;

    if (auth.user) {
      router.transitionTo('/models');
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
