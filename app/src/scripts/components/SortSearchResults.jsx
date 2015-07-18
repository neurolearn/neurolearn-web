'use strict';

import React from 'react';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import SearchSortTypes from '../constants/SearchSortTypes';

import styles from './SortSearchResults.scss';

function sortTitle(sortType) {
  return SearchSortTypes[sortType].title;
}

export default class SortSearchResults extends React.Component {
  renderMenuItems() {
    const sortTypes = ['MOST_IMAGES', 'FEWEST_IMAGES', 'RECENTLY_UPDATED'];

    return sortTypes.map(sortType =>
      <MenuItem eventKey={sortType} active={sortType === this.props.sortType}>{sortTitle(sortType)}</MenuItem>);
  }

  render() {
    return (
      <div className={styles.root}>
        <DropdownButton
          bsStyle='link'
          title={`Sort: ${sortTitle(this.props.sortType)}`}
          onSelect={this.props.onSelect} >
          {this.renderMenuItems()}
        </DropdownButton>
      </div>
    );
  }
}
