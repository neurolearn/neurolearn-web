import React from 'react';

const DashboardNav = (props) => {
  const { router, children } = props;
  return (
    <ul className="nav nav-tabs">
      <li role="presentation" className={router.isActive('/dashboard/models') && 'active'}><a href="#/dashboard/models">Models</a></li>
      <li role="presentation" className={router.isActive('/dashboard/tests') && 'active'}><a href="#/dashboard/tests">Tests</a></li>
      <li className="pull-right">
        {children}
      </li>
    </ul>
  );
};

export default DashboardNav;
