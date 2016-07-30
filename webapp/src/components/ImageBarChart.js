/* @flow */

import { sum, filter, pluck, isEmpty, every } from 'lodash';
import update from 'react/lib/update';
import React, { PropTypes } from 'react';
import { Input, Button } from 'react-bootstrap';
import BarChartRowContainer from './BarChartRowContainer.js';
import ImageLabel from './ImageLabel.js';
import GroupLabel from './GroupLabel.js';
import { filterImagesByName } from '../utils';

export default class ImageBarChart extends React.Component {
  state: {
    selected?: number,
    groups: Array<any>,
    filterText: string
  };

  static propTypes = {
    images: PropTypes.array.isRequired,
    groups: PropTypes.array,
    collections: PropTypes.object.isRequired,
    onGroupsChange: PropTypes.func.isRequired
  }

  constructor(props: Object) {
    super(props);
    this.state = {
      selected: undefined,
      groups: this.props.groups || [],
      filterText: ''
    };
    (this:any).handleFilterChange = this.handleFilterChange.bind(this);
    (this:any).handleGroupAdd = this.handleGroupAdd.bind(this);
    (this:any).handleGroupSelect = this.handleGroupSelect.bind(this);
    (this:any).handleGroupSave = this.handleGroupSave.bind(this);
    (this:any).handleGroupDelete = this.handleGroupDelete.bind(this);
    (this:any).handleImageToggle = this.handleImageToggle.bind(this);
    (this:any).isChecked = this.isChecked.bind(this);
  }

  collectionNameById(id: number) {
    return this.props.collections[id].name;
  }

  setCollectionName(images: Array<{collection_id: number}>) {
    return images.map(item => {
      return update(item, {
        collectionName: {
          $set: this.collectionNameById(item.collection_id)
        }
      });
    });
  }

  mean(images: Array<{id: number}>) {
    const rValues = pluck(filter(this.props.images, item => images[item.id]),
                          'r');
    if (rValues.length) {
      return sum(rValues) / rValues.length;
    } else {
      return 0;
    }
  }

  setCorrelation(groups: Array<{images: Array<{id: number}>}>) {
    return groups.map(item => {
      return update(item, {
        r: {
          $set: this.mean(item.images)
        }
      });
    });
  }

  setGroupsState(state: Object) {
    this.setState(state, () => this.props.onGroupsChange(this.state.groups));
  }

  showCheckbox() {
    return this.state.selected !== undefined;
  }

  toggleAll(images: Array<{id: number}>, checked: boolean) {
    const { selected } = this.state;

    if (selected === undefined) {
      return;
    }

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

  handleImageToggle(imageId: number, checked: boolean) {
    const { selected } = this.state;
    let groups;
    if (selected !== undefined) {
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

  isChecked(imageId: number) {
    const { selected, groups } = this.state;
    if (selected !== undefined) {
      return groups[selected].images[imageId];
    }

    return false;
  }

  isAllChecked(images: Array<{id: number}>) {
    return every(images, image => this.isChecked(image.id));
  }

  handleGroupSelect(index: number) {
    this.setState({
      selected: index,
      filterText: ''
    });
  }

  handleGroupSave(index: number, newGroupName: string) {
    const groups = update(this.state.groups, {
      [index]: {
        name: {
          $set: newGroupName
        }
      }
    });
    this.setGroupsState({groups: groups});
  }

  handleGroupDelete(index: number) {
    const { groups } = this.state;

    this.setGroupsState({
      groups: groups.slice(0, index).concat(groups.slice(index + 1)),
      selected: undefined
    });
  }

  handleGroupAdd(e: SyntheticMouseEvent) {
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

  renderEmptyImageList() {
    return (
      <div>No images matched your criteria.</div>
    );
  }

  render() {
    const images = this.setCollectionName(filterImagesByName(this.state.filterText,
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
                 onChange={this.handleFilterChange} />

          {!isEmpty(images) && this.showCheckbox()
            ? <Input type="checkbox"
                   label={`Select ${images.length} images`}
                   checked={this.isAllChecked(images)}
                   onChange={e => this.toggleAll(images, e.target.checked)}/>
            : <div style={{marginTop: 10, marginBottom: 10}}>{`${images.length} images`}</div>
          }

          {isEmpty(images)
            ? this.renderEmptyImageList()
            : <BarChartRowContainer
                items={images}
                label={ImageLabel}
                labelProps={{
                  showCheckbox: this.showCheckbox(),
                  onChange: this.handleImageToggle,
                  isChecked: this.isChecked
                }} />
           }
        </div>

        <div className="col-md-6">
          <h2>Groups</h2>
          <p>Groups images to calculate mean correlation</p>
          {!isEmpty(groups) &&
            <BarChartRowContainer
              items={groups}
              label={GroupLabel}
              labelProps={{
                selected: this.state.selected,
                onSelect: this.handleGroupSelect,
                onSave: this.handleGroupSave,
                onDelete: this.handleGroupDelete
              }} />
          }
          <Button style={{marginTop: 12}} onClick={this.handleGroupAdd} bsStyle="primary"><i className="fa fa-plus"></i> New Group</Button>
        </div>
      </div>
    );
  }
}
