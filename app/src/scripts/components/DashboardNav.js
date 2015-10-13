import React from 'react';

const DashboardNav = (props) => {
  const { router, children } = props;
  return (
    <ul className="nav nav-tabs">
      <li role="presentation" className={router.isActive('/models') && 'active'}><a href="#/models">Models</a></li>
      <li role="presentation" className={router.isActive('/tests') && 'active'}><a href="#/tests">Tests</a></li>
      <li className="pull-right">
        {children}
      </li>
    </ul>
  );
};

export default DashboardNav;
