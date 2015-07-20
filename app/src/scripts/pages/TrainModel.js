import React from 'react';
import Steps from '../components/Steps';

export default class TrainModel extends React.Component {
  static propTypes = {
    children: React.PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {
      collection: null,
      collectionId: null,
      finishedJobId: null,
      algorithm: null,
      targetData: null,
      showModal: false
    };
  }

  render() {
    return (
      <div>
        <Steps />

        {this.props.children}
      </div>
    );
  }
}
