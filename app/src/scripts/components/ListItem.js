import moment from 'moment';
import React, { PropTypes } from 'react';
import { Link } from 'react-router';

export default class ListItem extends React.Component {
  static propTypes = {
    item: PropTypes.object.isRequired
  };

  render() {
    const { item } = this.props;
    return (
      <div className="row">
        <div className="col-md-12">
          <h3><Link to={`/models/${item.id}`}>{item.name}</Link></h3>
          <p>Created <span className="datetime">{moment(item.created).fromNow()}</span></p>
        </div>
      </div>
    );
  }
}
