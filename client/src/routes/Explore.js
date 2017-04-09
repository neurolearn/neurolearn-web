/* @flow */

import capitalize from 'lodash/string/capitalize';
import React, { PropTypes } from 'react';
import NavItem from '../components/NavItem';
import ExploreItems from '../components/ExploreItems';
import { connect } from 'react-redux';

import { fetchJSON } from '../state/fetched';

const ITEM_TYPE_MAPPING = {
  'models': {
    serverItemType: 'MLModel'
  },
  'tests': {
    serverItemType: 'ModelTest'
  }
};

function keyName(itemType: string) {
  return `explore${capitalize(itemType)}`;
}

export class Explore extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    route: PropTypes.object.isRequired,
    fetched: PropTypes.object,
    params: PropTypes.object.isRequired
  };

  loadItems(itemType: string) {
    this.props.dispatch(fetchJSON(`/api/${itemType}`, keyName(itemType)));
  }

  componentDidMount() {
    const { itemType } = this.props.params;
    this.loadItems(itemType);
  }

  render() {
    const { itemType } = this.props.params;
    const { serverItemType } = ITEM_TYPE_MAPPING[itemType];
    const exploreItems = this.props.fetched[keyName(itemType)];

    if (!exploreItems) {
      return null;
    }

    return (
      <div className="container">
        <div className="page-header">
          <h1>Explore Neurolearn</h1>
        </div>
        <ul className="nav nav-tabs">
          <NavItem to="/explore/models" onClick={() => this.loadItems('models')}>Models</NavItem>
          <NavItem to="/explore/tests" onClick={() => this.loadItems('tests')}>Tests</NavItem>
        </ul>

        <ExploreItems itemType={serverItemType} items={exploreItems} />
      </div>
    );
  }
}

function select(state) {
  return state;
}

export default connect(select)(Explore);
