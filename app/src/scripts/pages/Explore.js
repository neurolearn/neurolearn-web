import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import ListItem from '../components/ListItem';

import { loadPublicMLModels } from '../state/publicMLModels';

export class Explore extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired
  };

  componentDidMount() {
    this.props.dispatch(loadPublicMLModels());
  }

  render() {
    const { publicMLModels, entities } = this.props;
    return (
      <div>
        <div className="page-header">
          <h1>Explore Neurolearn</h1>
        </div>
        <div>
        {publicMLModels.items.map(itemId =>
          <ListItem key={itemId}
                    item={entities.MLModel[itemId]}
                    entities={entities} />)}
        </div>
      </div>
    );
  }
}

function select(state) {
  return state;
}

export default connect(select)(Explore);
