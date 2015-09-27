import { sum, filter, pluck, isEmpty, every } from 'lodash';
import update from 'react/lib/update';
import React, { PropTypes } from 'react';
import { Input } from 'react-bootstrap';
import BarChartRowContainer from './BarChartRowContainer.js';
import ImageLabel from './ImageLabel.js';
import GroupLabel from './GroupLabel.js';

export default class ImageBarChart extends React.Component {
  static propTypes = {
    images: PropTypes.array.isRequired,
    groups: PropTypes.array,
    collections: PropTypes.object.isRequired,
    onGroupsChange: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      selected: null,
      groups: this.props.groups || [],
      filterText: ''
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

  setGroupsState(state) {
    this.setState(state, () => this.props.onGroupsChange(this.state.groups));
  }

  showCheckbox() {
    return this.state.selected !== null;
  }

  toggleAll(images, checked) {
    const { selected } = this.state;

    const imageMap = images.reduce((accum, image) => {
      accum[image.id] = checked;
      return accum;
    }, {});

    const groups = update(this.state.groups, {
      [selected]: {
        images: { $set: imageMap }
      }
    });

    this.setGroupsState({groups: groups});
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
      this.setGroupsState({groups: groups});
    }
  }

  isChecked(imageId) {
    const { selected, groups } = this.state;
    if (selected !== null) {
      return groups[selected].images[imageId];
    }

    return false;
  }

  isAllChecked(images) {
    return every(images, image => this.isChecked(image.id));
  }

  handleGroupSelect(index) {
    this.setState({
      selected: index,
      filterText: ''
    });
  }

  handleGroupSave(index, newGroupName) {
    const groups = update(this.state.groups, {
      [index]: {
        name: {
          $set: newGroupName
        }
      }
    });
    this.setGroupsState({groups: groups});
  }

  handleGroupDelete(index) {
    const { groups } = this.state;

    this.setGroupsState({
      groups: groups.slice(0, index).concat(groups.slice(index + 1)),
      selected: null
    });
  }

  handleGroupAdd(e) {
    e.preventDefault();
    const newGroup = {'name': 'New Group', r: 0, images: {}};
    const groups = update(this.state.groups, {$push: [newGroup]});
    this.setGroupsState({groups: groups, selected: groups.length - 1});
  }

  handleFilterChange() {
    this.setState({
      filterText: this.refs.filterText.getValue()
    });
  }

  filterImages(filterText, images) {
    if (isEmpty(filterText)) {
      return images;
    } else {
      const regex = new RegExp(filterText, 'i');
      return images.filter(image => image.name.search(regex) > -1);
    }
  }

  renderEmptyImageList() {
    return (
      <div>No images matched your criteria.</div>
    );
  }

  render() {
    const images = this.setCollectionName(this.filterImages(this.state.filterText,
                                                            this.props.images));
    const groups = this.setCorrelation(this.state.groups);

    return (
      <div className="row">
        <div className="col-md-6">
          <h2>Images</h2>
          <Input type="text"
                 placeholder="Filter Images"
                 value={this.state.filterText}
                 ref="filterText"
                 onChange={this.handleFilterChange.bind(this)} />

          {!isEmpty(images) && this.showCheckbox() &&
            <Input type="checkbox"
                   label={`Select ${images.length} images`}
                   checked={this.isAllChecked(images)}
                   onChange={e => this.toggleAll(images, e.target.checked)}/>
          }

          {isEmpty(images)
            ? this.renderEmptyImageList()
            : <BarChartRowContainer
                items={images}
                label={ImageLabel}
                labelProps={{
                  showCheckbox: this.showCheckbox(),
                  onChange: this.handleImageToggle.bind(this),
                  isChecked: this.isChecked.bind(this)
                }} />
           }
        </div>

        <div className="col-md-6">
          <h2>Groups</h2>
          {!isEmpty(groups) &&
            <BarChartRowContainer
              items={groups}
              label={GroupLabel}
              labelProps={{
                selected: this.state.selected,
                onSelect: this.handleGroupSelect.bind(this),
                onSave: this.handleGroupSave.bind(this),
                onDelete: this.handleGroupDelete.bind(this)
              }} />
          }
          <a href="#" onClick={this.handleGroupAdd.bind(this)}>Add a group…</a>
        </div>
      </div>
    );
  }
}
