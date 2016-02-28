import moment from 'moment';
import isEmpty from 'lodash/lang/isEmpty';

import React, { PropTypes } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Button, ButtonToolbar, Tabs, Tab, Modal } from 'react-bootstrap';
import Spinner from '../components/Spinner';
import NSViewer from '../components/NSViewer';
import FallbackImage from '../components/FallbackImage';
import { loadItemDetail, deleteItem } from '../state/itemDetail';
import { setTestModel } from '../state/testModel';
import { algorithmNameMap } from '../constants/Algorithms';
import TaskStateLabel from '../components/TaskStateLabel';
import RecentModelTests from '../components/RecentModelTests';
import CrossValidation from '../components/CrossValidation';
import { pluralize } from '../utils.js';

import styles from './ViewModel.scss';

export default class ViewModel extends React.Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    itemDetail: PropTypes.object,
    user: PropTypes.object,
    dispatch: PropTypes.func.isRequired
  }

  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      loadingImages: true,
      showViewerModal: false
    };
  }

  componentDidMount() {
    const { id } = this.props.params;
    this.props.dispatch(
      loadItemDetail(`/api/models/${parseInt(id)}`, 'model'));
  }

  renderState(model) {
    switch (model.state) {
      case 'queued':
      case 'progress':
        return this.renderProgress();
      case 'success':
        return this.renderModel(model);
      case 'failure':
        return this.renderFailure(model);
      default:
        throw 'Unknown model state.';
    }
  }

  renderProgress() {
    return (
      <div className="col-md-12" >
        <div style={{'paddingTop': 30, 'height': 30}}><Spinner opts={{position: 'relative'}}/></div>
        <div style={{'color': 'gray', 'margin': 40, 'textAlign': 'center'}}>Model training is in progress…</div>
      </div>
    );
  }

  renderFailure(model) {
    return (
      <div className="col-md-12">
        <div className="alert alert-danger">
          <h4>Training Failed</h4>
          {model.output_data.error}
        </div>
      </div>
    );
  }

  handleImagesLoaded() {
    this.setState({loadingImages: false});
  }

  renderModel(model) {
      const weightmapUrl = `/media/${model.id}/${model.output_data.weightmap}`;
      const images = [
      {
        id: 'anatomical',
        json: false,
        name: 'anatomical',
        colorPalette: 'grayscale',
        cache: true,
        download: '/static/data/anatomical.nii.gz',
        url: '/static/data/anatomical.nii.gz'
      },
      {
        'url': weightmapUrl,
        'name': 'weight map',
        'colorPalette': 'intense red-blue',
        'intent': 'z-score:',
        'opacity': 0.8,
        'sign': 'both'
      }
    ];

    const { summary, stats } = model.output_data;
    const { algorithm, cv, label } = model.input_data;

    return (
      <div>
        <div className="row weightmap">
          <div className="col-md-6">
            <h3>Weightmap</h3>
            <img style={{marginTop: 15}} src={`/media/${model.id}/${model.output_data.glassbrain}`} className="img-responsive"/>
            <div className="btn-toolbar" style={{marginTop: 10}}>
            <Button onClick={() => this.setState({showViewerModal: true, loadingImages: true})}>Open Interactive Viewer</Button>
            <a className="btn btn-link" href={weightmapUrl}><i className="fa fa-download"></i> Download NIfTI file</a>
            </div>
          </div>

          <div className="col-md-6">
          </div>
        </div>

        <div className="row weightmap">
          <div className='col-md-12' style={{marginTop: 20}}>
            {CrossValidation({label, cv, summary, stats})}
          </div>
        </div>

        <div className="row weightmap">
          <div className='col-md-12' style={{marginTop: 20}}>
              <p>Training duration: {Math.floor(model.output_data.duration) + ' sec'}</p>
          </div>
        </div>

        {this.state.showViewerModal &&
          this.renderViewerModal(images)
        }
      </div>
    );
  }

  renderViewerModal(images) {
    const onHide = () => this.setState({showViewerModal: false});

    return (
      <Modal bsSize='large' show={true} onHide={onHide} aria-labelledby='contained-modal-title-lg'>
        <Modal.Header closeButton>
          <Modal.Title id='contained-modal-title-lg'>Weightmap Viewer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <NSViewer images={images} onImagesLoaded={this.handleImagesLoaded.bind(this)}/>
          <ReactCSSTransitionGroup transitionName="overlay"
                                   transitionEnterTimeout={100}
                                   transitionLeaveTimeout={100}>
            {this.state.loadingImages && [<div className="overlay">&nbsp;</div>,
                                          <Spinner opts={{position: 'absolute'}} />]}
          </ReactCSSTransitionGroup>
          <div className="clearfix"></div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }

  renderTrainingData(inputData) {
    return (
      <table className="table">
        <thead>
          <tr>
            <th>Image</th>
            <th title="Training Label">{inputData.label.name}</th>
          </tr>
        </thead>
        <tbody>
          {inputData.data.map(row => <tr>
              <td>
                <FallbackImage src={`http://neurovault.org/media/images/${row.collection_id}/glass_brain_${row.id}.jpg`} />
                <p><a href={`http://neurovault.org/images/${row.id}/`}>{row.name}</a></p>
                <p style={{fontSize: 12, color: 'gray'}}>{inputData.collections[row.collection_id].name}</p>
              </td>
              <td>{row.target}</td>
            </tr>)}
        </tbody>
      </table>
    )
  }

  handleDelete(modelId) {
    const { router } = this.context;

    this.props.dispatch(deleteItem(`/api/models/${modelId}`,
      () => router.push('/dashboard/models')
    ));
  }


  handleTestModel(model) {
    const { router } = this.context;

    this.props.dispatch(setTestModel(model));
    router.push('/tests/new');
  }

  render() {
    const { itemDetail, user } = this.props;
    const model = itemDetail.item.model;

    if (!model || itemDetail.isFetching) {
      return <div>Loading model...</div>;
    }

    const userIsOwner = (model && user && model.user.id === user.user_id);

    return (
      <div className={styles.root}>
        <div className="page-header">
          <ButtonToolbar className="pull-right">
            {user && model.state === 'success' &&
              <Button bsStyle="primary"
                      onClick={() => this.handleTestModel(model)}>Test Model</Button>}
            {userIsOwner &&
              <Button bsStyle="danger"
                      onClick={() => this.handleDelete(model.id)}>Delete</Button>}
          </ButtonToolbar>
          <h1>{model.name}</h1>
        </div>

        <div className="row">
          <div className="col-sm-8">
            <p>{model.description}</p>
            <div>{model.user.name} <span style={{color: 'gray'}}>created</span> <time style={{color: 'gray'}} className="datetime">{moment(model.created).fromNow()}</time></div>
            <div>
              <table className="table overview" style={{marginTop: 10}}>
                <thead>
                  <tr>
                    <td className="col-md-4">Algorithm</td>
                    <td className="col-md-4">Training Label</td>
                    <td className="col-md-4">Training Dataset</td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{algorithmNameMap[model.algorithm]}</td>
                    <td>{model.input_data.label.name}</td>
                    <td>{model.input_data.data.length} {pluralize(model.input_data.data.length, 'image', 'images')}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="col-md-4 right-sidebar">
            <h4>Recent Model Tests</h4>
            {isEmpty(model.tests)
              ? <p>The model has not been tested yet.</p>
              : <RecentModelTests tests={model.tests} />}
          </div>
        </div>
        <div className="row tabs-wrapper">
          <div className="col-md-8">
            <Tabs defaultActiveKey={1} animation={false}>
              <Tab eventKey={1} title="Model">
                { model && this.renderState(model) }
              </Tab>
              <Tab eventKey={2} title="Training Data">
                { this.renderTrainingData(model.input_data) }
              </Tab>
            </Tabs>
          </div>
        </div>
      </div>
    );
  }
}

function select(state) {
  return {
    itemDetail: state.itemDetail,
    user: state.auth.user
  };
}

export default connect(select)(ViewModel);
