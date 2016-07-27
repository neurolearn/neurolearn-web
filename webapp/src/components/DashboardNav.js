/* @flow */

import React, { PropTypes } from 'react';
import NavItem from '../components/NavItem';

const DashboardNav = ({children} : {children? : any}) => (
  <ul className="nav nav-tabs">
    <NavItem to="/dashboard/models">Models</NavItem>
    <NavItem to="/dashboard/tests">Tests</NavItem>
    <li className="pull-right">
      {children}
    </li>
  </ul>
);

DashboardNav.propTypes = {
  children: PropTypes.node
}

export default DashboardNav;
