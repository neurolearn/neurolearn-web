/* @flow */

import React from 'react';
import NavItem from '../components/NavItem';

const TrainModel = ({children} : {children? : any}) => (
  <div>
    <ul className="nav nav-wizard">
      <NavItem to="/models/new/input-data">1. Input Data</NavItem>
      <NavItem to="/models/new/training-label">2. Training Label</NavItem>
      <NavItem to="/models/new/model-preferences">3. Model Preferences</NavItem>
    </ul>
    {children}
  </div>
);

TrainModel.propTypes = {
  children: React.PropTypes.node
};

export default TrainModel;
