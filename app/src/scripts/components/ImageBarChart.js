import { sum, filter, pluck, isEmpty } from 'lodash';
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

  constructor(props) {
    super(props);
    this.state = {
      selected: null,
      groups: []
    };
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

  mean(images) {
    const rValues = pluck(filter(this.props.images, item => images[item.id]),
                          'r');
    if (rValues.length) {
      return sum(rValues) / rValues.length;
    } else {
      return 0;
    }
  }

  setCorrelation(groups) {
    return groups.map(item => {
      return update(item, {
        r: {
          $set: this.mean(item.images)
        }
      });
    });
  }

  handleImageToggle(imageId, checked) {
    const { selected } = this.state;
    let groups;
    if (selected !== null) {
      groups = update(this.state.groups, {
        [selected]: {
          images: {
            [imageId]: {$set: checked}
          }
        }
      });
      this.setState({groups: groups});
    }
  }

  isChecked(imageId) {
    const { selected, groups } = this.state;
    if (selected !== null) {
      return groups[selected].images[imageId];
    }

    return false;
  }

  handleGroupSelect(index) {
    this.setState({selected: index});
  }

  handleGroupAdd(e) {
    e.preventDefault();
    const newGroup = {'name': 'New Group', r: 0, images: {}};
    const groups = update(this.state.groups, {$push: [newGroup]});
    this.setState({groups: groups, selected: groups.length - 1});
  }

  render() {
    const images = this.setCollectionName(this.props.images);
    const groups = this.setCorrelation(this.state.groups);
    return (
      <div>
        <h2>Images</h2>
        <BarChartRowContainer
          items={images}
          label={ImageLabel}
          labelProps={{
            showCheckbox: this.state.selected !== null,
            onChange: this.handleImageToggle.bind(this),
            isChecked: this.isChecked.bind(this)
          }} />

        <h2>Groups</h2>
        {!isEmpty(groups) &&
        <BarChartRowContainer
          items={groups}
          label={GroupLabel}
          labelProps={{
            selected: this.state.selected,
            onSelect: this.handleGroupSelect.bind(this)
          }} />
        }
        <a href="#" onClick={this.handleGroupAdd.bind(this)}>Add a group…</a>
      </div>
    );
  }
}
