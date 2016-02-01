import React, { PropTypes } from 'react';
import { Link } from 'react-router';

export default React.createClass({
  propTypes: {
    to: PropTypes.string.isRequired,
    query: PropTypes.object
  },
  contextTypes: {
    router: PropTypes.object.isRequired
  },

  render() {
    var isActive = this.context.router.isActive(this.props.to, this.props.query);
    var className = isActive ? 'active' : '';
    return <li className={className}><Link {...this.props}/></li>;
  }
});
