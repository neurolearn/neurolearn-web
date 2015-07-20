import React from 'react';

export default class ProgressBar extends React.Component {
  render() {
    return (
      <div className="progress">
        <div className="progress-bar" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style={{width: this.props.current + '%'}}>
          <span className="sr-only">60% Complete</span>
        </div>
      </div>
    );
  }
}

ProgressBar.propTypes = {
  current: React.PropTypes.number
};
