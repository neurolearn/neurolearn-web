import moment from 'moment';
import React, { PropTypes } from 'react';
import { Link } from 'react-router';

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

  render() {
    const { item } = this.props;

    return (
      <div className="row">
        <div className="col-md-12">
          {item && item.glassbrain &&
          <img src={`/media/${item.id}/${item.glassbrain}`} className="img-responsive"/>
          }
          <h3>{this.itemLink(item)}</h3>
          <p>Created <span className="datetime">{moment(item.created).fromNow()}</span></p>
          <p>{item.user.name}</p>
          <hr/>
        </div>
      </div>
    );
  }
}
