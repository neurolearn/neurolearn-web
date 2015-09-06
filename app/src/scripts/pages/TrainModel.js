import React from 'react';
import Steps from '../components/Steps';

export default class TrainModel extends React.Component {
  static propTypes = {
    children: React.PropTypes.object
  };

  render() {
    return (
      <div>
        <Steps />

        {this.props.children}
      </div>
    );
  }
}
