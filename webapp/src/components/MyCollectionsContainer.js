/* @flow */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import SearchResult from './search/SearchResult';

import styles from './search/ResultList.scss';

import { fetchJSON } from '../state/fetched';

const FETCHED_KEY = 'myCollectionList';

const MyCollectionList = ({ collectionList, onCollectionClick }) => {
  return collectionList.length ? (
    <div className={styles.root}>
      {collectionList.map(item =>
        <SearchResult
          key={item.id}
          source={item}
          onClick={() => onCollectionClick(item.id, 'MY_COLLECTIONS')}
        />)}
    </div>
  ) : (
    <div className={styles.root}>
      <h3>No collections found</h3>
    </div>
  );
};

MyCollectionList.propTypes = {
  collectionList: PropTypes.array,
  onCollectionClick: PropTypes.func.isRequired
};

class MyCollectionsContainer extends React.Component {
  static propTypes = {
    fetchFinished: PropTypes.bool,
    onCollectionClick: PropTypes.func.isRequired,
    collectionList: PropTypes.array.isRequired,
    dispatch: PropTypes.func.isRequired
  }

  componentDidMount() {
    if (!this.props.fetchFinished) {
      this.props.dispatch(fetchJSON('/api/user/neurovault-collections', FETCHED_KEY));
    }
  }

  render() {
    return this.props.fetchFinished ? (
      <MyCollectionList
        collectionList={this.props.collectionList}
        onCollectionClick={this.props.onCollectionClick}
      />
    ) : (
      <div>Loading…</div>
    );
  }
};

const filterEmpty = (collections) => {
  return collections.filter(x => x['number_of_images'] > 0);
};

const sortByPropDesc = (propName, collection) => {
  return collection.sort((a, b) => b[propName].localeCompare(a[propName]));
};

const mapStateToProps = (state) => {
  return {
    collectionList: sortByPropDesc('modify_date', filterEmpty(state.fetched[FETCHED_KEY] || [])),
    fetchFinished: state.fetched[FETCHED_KEY + '_fetchFinished']
  };
};

export default connect(mapStateToProps)(MyCollectionsContainer);
