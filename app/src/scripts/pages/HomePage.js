import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import MLModels from './dashboard/MLModels';
import LoggedOut from './LoggedOut';
import { fetchJSON } from '../state/fetched';

export default class HomePage extends React.Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
    history: PropTypes.object
  };

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    fetched: PropTypes.object
  };

  componentWillMount() {
    const { auth, dispatch } = this.props;

    if (!auth.user) {
      dispatch(fetchJSON('/api/stats', 'stats'));
    }
  }

  componentWillReceiveProps() {
    const { auth } = this.props;
    const { router, history } = this.context;

    if (auth.user) {
      router.push('/dashboard/models');
    }
  }

  render() {
    const { auth, fetched } = this.props;
    return auth.user ? <MLModels /> : <LoggedOut stats={fetched.stats} />;
  }
}

function select(state) {
  return state;
}

export default connect(select)(HomePage);
