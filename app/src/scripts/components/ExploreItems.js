import React, { PropTypes } from 'react';
import ListItem from '../components/ListItem';

export default class ExploreItems extends React.Component {
  static propTypes = {
    entities: PropTypes.object,
    items: PropTypes.array.isRequired,
    itemType: PropTypes.string.isRequired
  };

  render() {
    const { entities, items, itemType } = this.props;

    return (
      <div>
      {items.map(itemId =>
        <ListItem key={itemId}
                  itemType={itemType}
                  item={entities[itemType][itemId]}
                  entities={entities} />)}
      </div>
    );
  }
}
