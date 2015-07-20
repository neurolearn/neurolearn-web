import React from 'react';
import { Link } from 'react-router';

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
        <ul className="nav nav-wizard">
          <li className="active"><Link to="/train-model/input-data">1. Input Data</Link></li>
          <li><Link to="/train-model/training-label">2. Training Label</Link></li>
          <li><a href="#">3. Model Preferences</a></li>
          <li><a href="#">4. Review</a></li>
        </ul>

        {this.props.children}
      </div>
    );
  }
}
