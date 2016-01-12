import React from 'react';
import NavItem from '../components/NavItem';

export default class Explore extends React.Component {
  static propTypes = {
    children: React.PropTypes.object
  };

  render() {
    return (
      <div>
        <div className="page-header">
          <h1>Explore Neurolearn</h1>
        </div>
        <ul className="nav nav-tabs">
          <NavItem to="/explore">Models</NavItem>
          <NavItem to="/explore/tests">Tests</NavItem>
        </ul>

        {this.props.children}
      </div>
    );
  }
}

