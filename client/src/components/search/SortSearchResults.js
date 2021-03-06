/* @flow */

import React from 'react';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import SearchSortTypes from '../../constants/SearchSortTypes';

import styles from './SortSearchResults.scss';

const SORT_TYPES = ['MOST_IMAGES', 'FEWEST_IMAGES', 'RECENTLY_UPDATED'];

function sortTitle(sortType: string): string {
  return SearchSortTypes[sortType].title;
}

export default class SortSearchResults extends React.Component {
  static propTypes = {
    sortType: React.PropTypes.oneOf(SORT_TYPES),
    onSelect: React.PropTypes.func
  };

  renderMenuItems(sortTypes: Array<string>) {
    return sortTypes.map(sortType => (
      <MenuItem
        key={sortType}
        eventKey={sortType}
        active={sortType === this.props.sortType}
      >
        {sortTitle(sortType)}
      </MenuItem>
    ));
  }

  render() {
    return (
      <div className={styles.root}>
        <DropdownButton
          id="sortType"
          bsStyle="link"
          title={`Sort: ${sortTitle(this.props.sortType)}`}
          onSelect={eventKey => this.props.onSelect(eventKey)}
        >
          {this.renderMenuItems(SORT_TYPES)}
        </DropdownButton>
      </div>
    );
  }
}
