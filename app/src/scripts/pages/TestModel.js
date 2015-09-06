import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import SearchContainer from '../components/SearchContainer';
import SelectedCollectionList from '../components/SelectedCollectionList';

export default class TestModel extends React.Component {
  static propTypes = {
  };

  countSelectedInCollection(collection) {
    if (!collection) {
      return 0;
    }
    return Object.keys(collection).reduce((accum, key) =>
      collection[key] ? accum + 1 : accum,
    0);
  }

  countSelectedImages(selectedImages) {
    return Object.keys(selectedImages).reduce((accum, key) =>
      this.countSelectedInCollection(selectedImages[key]) + accum,
    0);
  }

  render() {
    const { selectImagesModal, selectedImages, dispatch } = this.props;
    const anySelected = this.countSelectedImages(selectedImages.images) === 0;

    return (
      <div>
        <h1 className="page-header">Test Model</h1>
        <div className="row">
          <div className="col-md-9">
            <div className="panel panel-default">
              <div className="panel-body">
                <SearchContainer {...this.props.search}
                                 onFilterChange={this.handleFilterChange.bind(this)}
                                 onSearchInputChange={this.handleSearchInputChange.bind(this)}
                                 onSortSelect={this.handleSortSelect.bind(this)}
                                 onPageSelect={this.handlePageSelect.bind(this)}
                                 onSearchResultClick={this.handleCollectionClick.bind(this)} />
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="panel panel-default">
              <div className="panel-heading">
                <h3 className="panel-title">Selected Images</h3>
              </div>
              <div className={classNames('panel-body', anySelected && 'empty-dataset')}>
                { anySelected
                  ? <p>Training dataset is empty.</p>
                  : <SelectedCollectionList selectedImages={selectedImages}
                               onItemClick={(id) => this.handleCollectionClick(id)} />
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function select(state) {
  return state;
}

export default connect(select)(TestModel);
