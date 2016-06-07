import values from 'lodash/object/values';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router';

import SearchContainer from '../components/search/SearchContainer';
import SelectImagesModal from '../components/SelectImagesModal';
import SelectedCollectionList from '../components/SelectedCollectionList';

import { testModel } from '../state/testModel';

import {
  showSelectImagesModal,
  hideSelectImagesModal
} from '../state/selectImagesModal';

import {
  toggleImage,
  toggleImageList,
} from '../state/selectedImages';

import {
  loadSearchResults,
  inputSearchQuery,
} from '../state/search';

export default class TestModel extends React.Component {
  static propTypes = {
    search: PropTypes.object,
    testModel: PropTypes.object,
    selectedImages: PropTypes.object,
    selectImagesModal: PropTypes.object,
    dispatch: PropTypes.func.isRequired
  };

  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
    this.handleImageToggle = this.handleImageToggle.bind(this);
    this.handleImageListToggle = this.handleImageListToggle.bind(this);
  }

  componentDidMount() {
    if (!this.props.search.results) {
      this.props.dispatch(loadSearchResults(inputSearchQuery('')));
    }
  }

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

  getSelectedImagesInCollection(selectedImages, collectionId) {
    return selectedImages[collectionId];
  }

  getCollection(collectionId, collectionsById) {
    const { results } = this.props.search;
    let collection = collectionsById[collectionId];

    if (collection) {
      return collection;
    }

    if (!results) {
      return null;
    }

    collection = results.hits.hits.filter(function (item) {
      return item._id === collectionId;
    })[0];

    return collection;
  }

  handleCollectionClick(id) {
    this.props.dispatch(showSelectImagesModal(id));
  }

  handleImageToggle(collection, imageId) {
    this.props.dispatch(toggleImage(collection, imageId));
  }

  handleImageListToggle(collection, images, checked) {
    this.props.dispatch(toggleImageList(collection, images, checked));
  }

  handleTestModelClick(e) {
    e.preventDefault();
    const { router } = this.context;
    const { selectedImages } = this.props;
    const name = values(selectedImages.collectionsById).map(c => c._source.name).join(', ');
    this.props.dispatch(testModel(name,
                                  this.props.testModel.model.id,
                                  selectedImages.images,
                                  router));
  }

  render() {
    const { selectImagesModal, selectedImages, testModel, dispatch } = this.props;
    const anySelected = this.countSelectedImages(selectedImages.images) === 0;

    return (
      <div>
        <h1 className="page-header">Test Model</h1>
        <p className="lead">Search NeuroVault collections and select images to test a model on.</p>

        <div className="row">
          <div className="col-md-9">
            <div className="panel panel-default">
              <div className="panel-body">
                <SearchContainer {...this.props.search}
                                 dispatch={this.props.dispatch}
                                 onSearchResultClick={this.handleCollectionClick.bind(this)} />
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="panel panel-default">
              <div className="panel-heading">
                <h3 className="panel-title">Model</h3>
              </div>
              <div className='panel-body'>
                { testModel.model
                  ? <p><Link to={`/models/${testModel.model.id}`}>{testModel.model.name}</Link></p>
                  : <p>No test model has been selected.</p>
                }
              </div>
            </div>

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
                <Button disabled={anySelected || testModel.isFetching}
                        bsStyle="primary"
                        onClick={this.handleTestModelClick.bind(this)}>{testModel.isFetching ? 'Please wait…' : 'Test Model'}</Button>
              </div>
            </div>
          </div>
        </div>
        {selectImagesModal.collectionId &&
          <SelectImagesModal
            show={selectImagesModal.display}
            onToggle={this.handleImageToggle}
            onToggleList={this.handleImageListToggle}
            collection={this.getCollection(selectImagesModal.collectionId,
                                           selectedImages.collectionsById)}
            selectedImages={this.getSelectedImagesInCollection(selectedImages.images,
                                                               selectImagesModal.collectionId)}
            onHide={() => dispatch(hideSelectImagesModal())} />
        }
      </div>
    );
  }
}

function select(state) {
  return state;
}

export default connect(select)(TestModel);
