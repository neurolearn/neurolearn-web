import React, { PropTypes } from 'react';
import NavItem from '../components/NavItem';
import ExploreItems from '../components/ExploreItems';
import { connect } from 'react-redux';

import { loadPublicMLModels } from '../state/publicMLModels';
import { loadPublicModelTests } from '../state/publicModelTests';

const ITEM_TYPE_MAPPING = {
  'models': {
    actionType: loadPublicMLModels,
    store: 'publicMLModels',
    serverItemType: 'MLModel'
  },
  'tests': {
    actionType: loadPublicModelTests,
    store: 'publicModelTests',
    serverItemType: 'ModelTest'
  }
};

export class Explore extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    route: PropTypes.object.isRequired,
    publicMLModels: PropTypes.object,
    publicModelTests: PropTypes.object,
    params: PropTypes.object.isRequired,
    entities: PropTypes.object.isRequired
  };

  loadItems(itemType) {
    const { actionType } = ITEM_TYPE_MAPPING[itemType];
    this.props.dispatch(actionType());
  }

  componentDidMount() {
    const { itemType } = this.props.params;
    this.loadItems(itemType);
  }

  render() {
    const { entities } = this.props;
    const { itemType } = this.props.params;
    const store = this.props[ITEM_TYPE_MAPPING[itemType].store];
    const { serverItemType } = ITEM_TYPE_MAPPING[itemType];

    return (
      <div>
        <div className="page-header">
          <h1>Explore Neurolearn</h1>
        </div>
        <ul className="nav nav-tabs">
          <NavItem to="/explore/models" onClick={() => this.loadItems('models')}>Models</NavItem>
          <NavItem to="/explore/tests" onClick={() => this.loadItems('tests')}>Tests</NavItem>
        </ul>

        <ExploreItems itemType={serverItemType} items={store.items} entities={entities} />
      </div>
    );
  }
}

function select(state) {
  return state;
}

export default connect(select)(Explore);
