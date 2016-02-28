import React, { PropTypes } from 'react';
import { Link } from 'react-router';

import { pluralize } from '../utils.js';

const RecentModelTests = ({ tests }) => {
  return (
    <div>
      {tests.map(test => <div key={test.id}>
          <Link to={`/tests/${test.id}`}>{test.name}</Link>
          <p>
            {test.images_count} {pluralize(test.images_count, 'image', 'images')} • {test.mean_correlation} mean r
          </p>
        </div>)}
    </div>
  );
};

RecentModelTests.propTypes = {
  tests: PropTypes.array.isRequired
}

export default RecentModelTests;
