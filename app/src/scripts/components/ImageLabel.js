import React, { PropTypes } from 'react';
import { Input } from 'react-bootstrap';

import styles from './ImageLabel.scss';

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
      <div className={styles.root}>
        {showCheckbox &&
          <Input type='checkbox'
                 checked={this.props.isChecked(item.id)}
                 onChange={e => this.props.onChange(item.id, e.target.checked)}/>
        }
        <div className="image-name">{item.name}</div>
        <p className="collection-name">{item.collectionName}</p>
      </div>
    );
  }
}
