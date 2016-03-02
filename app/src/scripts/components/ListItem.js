import styles from './ListItem.scss';

import moment from 'moment';
import React, { PropTypes } from 'react';
import { Link } from 'react-router';

import { algorithmNameMap } from '../constants/Algorithms';
import { pluralize } from '../utils.js';


const BASE_URL = {
  'MLModel': 'models',
  'ModelTest': 'tests'
};

export default class ListItem extends React.Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
    itemType: PropTypes.string.isRequired
  };

  itemLink(item) {
    const baseURL = BASE_URL[this.props.itemType];
    return <Link to={`/${baseURL}/${item.id}`}>{item.name}</Link>;
  }

  renderTestSummary(item) {
    return (
      <p>{item.images_count} {pluralize(item.images_count, 'image', 'images')} • {item.mean_correlation} mean <var>r</var></p>
    );
  }

  renderModelSummary(item) {
    return (
      <p>{item.images_count} {pluralize(item.images_count, 'image', 'images')} • {algorithmNameMap[item.algorithm]} • <span style={{color: 'gray'}}>Training label:</span> {item.label_name}</p>
    );
  }

  render() {
    const { item } = this.props;

    return (
      <div className={styles.root}>
        <div className="row" style={{paddingTop: 20, paddingBottom: 20 }}>
          <div className="col-sm-6">
            <p>{item.user.name} <span style={{color: 'gray'}}>created <span className="datetime">{moment(item.created).fromNow()}</span></span></p>
            <h3 style={{fontSize: 18}}>{this.itemLink(item)}</h3>
            {this.props.itemType === 'MLModel' ? this.renderModelSummary(item) : this.renderTestSummary(item) }
          </div>
          <div className="col-sm-6">
            {item && item.glassbrain &&
              <img src={`/media/${item.id}/${item.glassbrain}`} className="img-responsive"/> }

          </div>
        </div>
      </div>
    );
  }
}
