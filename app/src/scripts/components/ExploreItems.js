import React, { PropTypes } from 'react';
import ListItem from '../components/ListItem';

export default class ExploreItems extends React.Component {
  static propTypes = {
    items: PropTypes.array.isRequired,
    itemType: PropTypes.string.isRequired
  };

  render() {
    const { items, itemType } = this.props;

    return (
      <div style={{paddingTop: 10}}>
      {items.map(item =>
        <ListItem key={item.id}
                  itemType={itemType}
                  item={item} />)}
      </div>
    );
  }
}
