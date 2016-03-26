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
    fetched: PropTypes.object
  };

  componentWillMount() {
    const { dispatch } = this.props;

    dispatch(fetchJSON('/api/stats', 'stats'));
  }

  render() {
    const { fetched } = this.props;
    return <LoggedOut stats={fetched.stats} />;
  }
}

function select(state) {
  return state;
}

export default connect(select)(HomePage);
