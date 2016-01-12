import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import ListItem from '../components/ListItem';

import { loadPublicMLModels } from '../state/publicMLModels';

export class Explore extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    publicMLModels: PropTypes.object,
    entities: PropTypes.object
  };

  componentDidMount() {
    this.props.dispatch(loadPublicMLModels());
  }

  render() {
    const { publicMLModels, entities } = this.props;
    return (
      <div>
      {publicMLModels.items.map(itemId =>
        <ListItem key={itemId}
                  item={entities.MLModel[itemId]}
                  entities={entities} />)}
      </div>
    );
  }
}

function select(state) {
  return state;
}

export default connect(select)(Explore);
