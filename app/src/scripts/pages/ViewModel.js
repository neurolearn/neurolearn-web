import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

export default class ViewModel extends React.Component {
  static propTypes = {
    params: PropTypes.object.isRequired
  }

  render() {
    const { mlModels, params } = this.props;
    const model = mlModels[parseInt(params.id)];

    return (
      <div>
        <h1 className="page-header">{model.name}</h1>
      </div>
    );
  }
}

function select(state) {
  return state;
}

export default connect(select)(ViewModel);
