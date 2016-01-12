import React from 'react';
import NavItem from '../components/NavItem';

export default class TrainModel extends React.Component {
  static propTypes = {
    children: React.PropTypes.object
  };

  render() {
    return (
      <div>
        <ul className="nav nav-wizard">
          <NavItem to="/models/new/input-data">1. Input Data</NavItem>
          <NavItem to="/models/new/training-label">2. Training Label</NavItem>
          <NavItem to="/models/new/model-preferences">3. Model Preferences</NavItem>
        </ul>

        {this.props.children}
      </div>
    );
  }
}
