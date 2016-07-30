import React, { Component, PropTypes } from 'react';
import { Router } from 'react-router';
import { Provider } from 'react-redux';

class AppContainer extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    routes: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
  }

  render() {
    const { history, routes, store } = this.props;

    return (
      <Provider store={store}>
        {/* react-kit <Router history={history} children={routes} /> */}
        <Router history={history} children={routes} />
        {/* () => renderRoutes(store, browserHistory) */}

      </Provider>
    );
  }
}

export default AppContainer;
