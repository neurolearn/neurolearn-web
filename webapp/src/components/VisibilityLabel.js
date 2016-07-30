/* @flow */

import React, { PropTypes } from 'react';
import classNames from 'classnames';

const VisibilityLabel = (
  { isPrivate, onClick }
: { isPrivate: boolean, onClick: (e: SyntheticEvent) => void }
) => {
  const visibility = isPrivate
    ? { iconClass: 'fa fa-lock', title: 'private', spanClass: 'visibility-private' }
    : { title: 'public', spanClass: 'visibility-public' };

  return (
    <span
      className={classNames('visibility-label', visibility.spanClass)}
      onClick={onClick}>{isPrivate && <i className="fa fa-lock"></i>} {visibility.title}</span>
  );
};

VisibilityLabel.propTypes = {
  isPrivate: PropTypes.bool,
  onClick: PropTypes.func
};

export default VisibilityLabel;
