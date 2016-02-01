import React from 'react';
import NavItem from '../components/NavItem';

const DashboardNav = (props) => {
  const { children } = props;
  return (
    <ul className="nav nav-tabs">
      <NavItem to="/dashboard/models">Models</NavItem>
      <NavItem to="/dashboard/tests">Tests</NavItem>
      <li className="pull-right">
        {children}
      </li>
    </ul>
  );
};

export default DashboardNav;
