import moment from 'moment';
import React, { PropTypes } from 'react';
import { Link } from 'react-router';

export default class ListItem extends React.Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
    entities: PropTypes.object.isRequired
  };

  render() {
    const { item, entities } = this.props;
    const user = entities.User[item.user];

    return (
      <div className="row">
        <div className="col-md-12">
          <h3><Link to={`/models/${item.id}`}>{item.name}</Link></h3>
          <p>Created <span className="datetime">{moment(item.created).fromNow()}</span></p>
          <p>{user.name}</p>
        </div>
      </div>
    );
  }
}
