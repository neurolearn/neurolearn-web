/* @flow */

import React from 'react';
import { Link } from 'react-router';

const NotFound = () => (
  <div className="container">
    <h1>Page Not Found</h1>
    <Link to="/">Home</Link>
  </div>
);

export default NotFound;
