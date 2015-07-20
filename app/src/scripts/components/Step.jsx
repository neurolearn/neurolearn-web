import React, { PropTypes } from 'react';
import { Link, State } from 'react-router';

export default React.createClass({
  propTypes: {
    to: PropTypes.string.isRequired,
    query: PropTypes.object
  },

  mixins: [ State ],

  render() {
    var isActive = this.isActive(this.props.to, this.props.query);
    var className = isActive ? 'active' : '';
    return <li className={className}><Link {...this.props}/></li>;
  }
});
