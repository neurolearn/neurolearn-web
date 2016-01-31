import React, { PropTypes } from 'react';
import NavItem from '../components/NavItem';
import ExploreItems from '../components/ExploreItems';
import { connect } from 'react-redux';

import { loadItemList } from '../state/itemList';

const ITEM_TYPE_MAPPING = {
  'models': {
    serverItemType: 'MLModel'
  },
  'tests': {
    serverItemType: 'ModelTest'
  }
};

export class Explore extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    route: PropTypes.object.isRequired,
    itemList: PropTypes.object,
    params: PropTypes.object.isRequired
  };

  loadItems(itemType) {
    this.props.dispatch(loadItemList(`/api/${itemType}`));
  }

  componentDidMount() {
    const { itemType } = this.props.params;
    this.loadItems(itemType);
  }

  render() {
    const { itemType } = this.props.params;
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

        <ExploreItems itemType={serverItemType} items={this.props.itemList.items} />
      </div>
    );
  }
}

function select(state) {
  return state;
}

export default connect(select)(Explore);
