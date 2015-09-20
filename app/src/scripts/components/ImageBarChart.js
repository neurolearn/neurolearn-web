import update from 'react/lib/update';
import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import BarChartRowContainer from './BarChartRowContainer.js';
import ImageLabel from './ImageLabel.js';
import GroupLabel from './GroupLabel.js';

export default class ImageBarChart extends React.Component {
  static propTypes = {
    images: PropTypes.array.isRequired,
    collections: PropTypes.object.isRequired
  }

  collectionNameById(id) {
    return this.props.collections[id].name;
  }

  setCollectionName(images) {
    return images.map(item => {
      return update(item, {
        collectionName: {
          $set: this.collectionNameById(item.collection_id)
        }
      });
    });
  }

  render() {
    const images = this.setCollectionName(this.props.images);

    const groups = [
      {name: 'Pain', r: 0.18},
      {name: 'Memory', r: -0.82}
    ];

    return (
      <div>
      <h2>Images</h2>
      <BarChartRowContainer items={images} label={ImageLabel} />
      <h2>Groups</h2>
      <BarChartRowContainer items={groups} label={GroupLabel} />
      <Button bsStyle="link">Add a group…</Button>
      </div>
    );
  }
}
