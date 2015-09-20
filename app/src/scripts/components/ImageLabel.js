import React, { PropTypes } from 'react';
import { Input } from 'react-bootstrap';

export default class ImageLabel extends React.Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
    showCheckbox: PropTypes.bool,
    isChecked: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired
  }

  render() {
    const { item, showCheckbox } = this.props;

    return (
      <div>
        {showCheckbox &&
          <Input type='checkbox'
                 checked={this.props.isChecked(item.id)}
                 onChange={e => this.props.onChange(item.id, e.target.checked)}/>
        }
        <h3>{item.name}</h3>
        <p style={{marginRight: 5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{item.collectionName}</p>
      </div>
    );
  }
}
