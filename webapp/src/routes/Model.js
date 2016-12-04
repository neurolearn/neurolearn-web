/* @flow */

import moment from 'moment';
import isEmpty from 'lodash/lang/isEmpty';
import classNames from 'classnames';

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Button, ButtonToolbar, Tabs, Tab } from 'react-bootstrap';
import { fetchJSON, patchItem, deleteItem } from '../state/fetched';
import Spinner from '../components/Spinner';
import { setTestModel } from '../state/testModel';
import RecentModelTests from '../components/RecentModelTests';
import CrossValidation from '../components/CrossValidation';
import ImageViewerModal from '../components/ImageViewerModal';
import ModelTrainingData from '../components/ModelTrainingData';
import ModelOverview from '../components/ModelOverview';
import RadioGroup from '../components/RadioGroup';
import ModalDialog from '../components/ModalDialog';
import VisibilityLabel from '../components/VisibilityLabel';
import EditableText from '../components/EditableText';
import NotFound from '../components/NotFound';
import Events from '../utils/events';

import { retrainModelWith } from '../state/modelPreferences';

import {
  algorithmGroups,
  algorithmNameMap
} from '../constants/Algorithms';

import { analysisTypeOfAlgorithm } from '../utils';

import styles from './Model.scss';

class Model extends React.Component {
  state: {
    loadingImages: boolean,
    showViewerModal: boolean,
    showModal?: string,
    algorithm: string,
    name: string
  };

  static propTypes = {
    params: PropTypes.object.isRequired,
    model: PropTypes.object,
    user: PropTypes.object,
    isFetching: PropTypes.bool.isRequired,
    isNotFound: PropTypes.bool,
    dispatch: PropTypes.func.isRequired
  }

  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  constructor(props: Object) {
    super(props);
    this.state = {
      loadingImages: true,
      showViewerModal: false,
      showModal: undefined,
      algorithm: '',
      name: ''
    };

    (this:any).handleAlgorithmClick = this.handleAlgorithmClick.bind(this);
    (this:any).handleVisibilityLabelClick = this.handleVisibilityLabelClick.bind(this);
    (this:any).handleVisibilityToggle = this.handleVisibilityToggle.bind(this);
    (this:any).handleChangeAlgorithm = this.handleChangeAlgorithm.bind(this);
    (this:any).handleSaveModelName = this.handleSaveModelName.bind(this);
    (this:any).handleSaveDescription = this.handleSaveDescription.bind(this);
    (this:any).handleSaveAndRetrain = this.handleSaveAndRetrain.bind(this);
  }

  componentDidMount() {
    const {dispatch, params: { id }} = this.props;
    dispatch(fetchJSON(`/api/models/${parseInt(id)}`, 'model'));
  }

  handleDelete(modelId) {
    const { router } = this.context;
    const { dispatch } = this.props;

    dispatch(deleteItem(`/api/models/${modelId}`,
      () => router.push('/dashboard/models')
    ));
  }

  handleTestModel(model) {
    const { router } = this.context;
    const { dispatch } = this.props;

    dispatch(setTestModel(model));
    router.push('/tests/new');
  }

  handleAlgorithmClick(e: SyntheticEvent) {
    e.preventDefault();
    this.setState({ showModal: 'algorithm' });
  }

  handleVisibilityLabelClick(e: SyntheticEvent) {
    e.preventDefault();
    this.setState({ showModal: 'visibility' });
  }

  handleSaveModelName(name: string) {
    const { model, dispatch } = this.props;
    dispatch(patchItem(`/api/models/${model.id}`, 'model', {name}));
  }

  handleSaveDescription(description) {
    const { model, dispatch } = this.props;
    dispatch(patchItem(`/api/models/${model.id}`, 'model', {description}));
  }

  handleVisibilityToggle() {
    const { model, dispatch } = this.props;
    const newValue = !model.private;

    dispatch(patchItem(`/api/models/${model.id}`, 'model', {'private': newValue}));
    this.setState({showModal: undefined});
  }

  handleChangeAlgorithm(e: SyntheticEvent) {
    this.setState({ algorithm: Events.target(e, HTMLInputElement).value });
  }

  handleSaveAndRetrain() {
    const { algorithm } = this.state;
    const { model, dispatch } = this.props;
    const { router } = this.context;

    dispatch(retrainModelWith(
      model.id,
      {algorithm},
      () => router.push('/dashboard/models'))
    );
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
        throw new Error('Unknown model state.');
    }
  }

  renderProgress() {
    return (
      <div className="col-md-12" >
        <div style={{'paddingTop': 65, 'height': 30}}><Spinner opts={{position: 'relative'}} /></div>
        <div style={{'color': 'gray', 'margin': 40, 'textAlign': 'center'}}>Model training is in progress…</div>
      </div>
    );
  }

  renderFailure(model) {
    return (
      <div className="col-md-12" style={{padding: 20}}>
        <div className="alert alert-danger">
          <h4>Training Failed</h4>
          {model.output_data.error}
        </div>
      </div>
    );
  }

  renderAlgorithmSelection(algorithm) {
    const analysisType = analysisTypeOfAlgorithm(algorithm);
    const items = algorithmGroups[analysisType].map(
      type => ({value: type, name: algorithmNameMap[type]}));
    return (
      <RadioGroup
        items={items}
        selected={this.state.algorithm || algorithm}
        onChange={this.handleChangeAlgorithm}
      />
    );
  }

  renderVisibilityToggle(model) {
    const visibility = model.private
      ? { iconClass: 'fa fa-unlock', status: 'public' }
      : { iconClass: 'fa fa-lock', status: 'private' };

    return (
      <div className="text-center">
        <Button
          bsStyle="primary"
          onClick={this.handleVisibilityToggle}>
          <i className={visibility.iconClass}></i>
          {' Make this model '}
          {visibility.status}
        </Button>
      </div>
    );
  }

  renderModel(model) {
    const weightmapUrl = `/media/${model.id}/${model.output_data.weightmap}`;

    const { summary, stats, glassbrain, roc_plot } = model.output_data;
    const { cv, label } = model.input_data;

    return (
      <div>
        <div className="row weightmap">
          <div className="col-md-12">
            <h3>Weightmap</h3>
            <table>
              <tbody>
                <tr>
                  <td className="col-md-6">
                    <img style={{marginTop: 15}} src={`/media/${model.id}/${glassbrain}`} className="img-responsive" />
                  </td>
                  <td className="col-md-6" style={{textAlign: 'center'}}>
                    <div>
                      <Button
                        onClick={() => this.setState({showViewerModal: true, loadingImages: true})}
                      >Open Interactive Viewer
                      </Button>
                    </div>
                    <div>
                      <a className="btn btn-link" href={weightmapUrl}><i className="fa fa-download"></i>
                      Download NIfTI file</a>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {cv &&
          <div className="row weightmap">
            <div className="col-md-12" style={{marginTop: 20}}>
              {CrossValidation({modelId: model.id, label, cv, summary, stats, roc_plot})}
            </div>
          </div>}

        {this.state.showViewerModal &&
          <ImageViewerModal weightmapUrl={weightmapUrl}
            loadingImages={this.state.loadingImages}
            onHide={() => this.setState({showViewerModal: false})}
            onImagesLoaded={() => this.setState({loadingImages: false})}
          />
        }
      </div>
    );
  }

  renderModelNameWithLabel(model, userIsOwner) {
    return userIsOwner
      ? [
        <EditableText
          value={model.name}
          onChange={this.handleSaveModelName}
          modalTitle="Rename Model"
        />,
        <VisibilityLabel
          isPrivate={model.private}
          onClick={this.handleVisibilityLabelClick}
        />
      ]
      : model.name;
  }

  renderModelDescription(description, userIsOwner) {
    return userIsOwner
        ? <EditableText
          allowBlank
          value={description}
          onChange={this.handleSaveDescription}
          modalTitle="Edit Description"
          >{description || <em style={{color: '#777'}}>Edit the description…</em>}</EditableText>
        : description;
  }

  renderModelMeta(model, userIsOwner) {
    return (
      <div>
        <h1>{this.renderModelNameWithLabel(model, userIsOwner)}</h1>
        <p>{this.renderModelDescription(model.description, userIsOwner)}</p>
        <p>
          {model.user.name}
          {' '}
          <span style={{color: 'gray'}}>created</span>
          {' '}
          <time style={{color: 'gray'}} className="datetime">{moment(model.created).fromNow()}</time>
        </p>
      </div>
    );
  }

  render() {
    const {
      user,
      model,
      isFetching,
      isNotFound,
      params: { id: loadingModelId }
    } = this.props;

    if (isFetching && !(model && loadingModelId === model.id)) {
      return <div className="text-center">Loading model…</div>;
    }

    if (!model) {
      if (isNotFound) {
        return <NotFound />;
      } else {
        return null;
      }
    }

    const userIsOwner = (model && user && model.user.id === user.id);

    return (
      <div className={classNames('container', styles.root)}>
        <div className="page-header">
          <ButtonToolbar className="pull-right">
            {user && model.state === 'success' &&
              <Button bsStyle="primary"
                onClick={() => this.handleTestModel(model)}
              >Test Model</Button>}
            {userIsOwner &&
              <Button bsStyle="danger"
                onClick={() => this.handleDelete(model.id)}
              >Delete</Button>}
          </ButtonToolbar>
          {this.renderModelMeta(model, userIsOwner)}
        </div>

        <div className="row">
          <div className="col-sm-8">
            <ModelOverview model={model}
              user={user}
              onAlgorithmClick={this.handleAlgorithmClick} />
            <div className="row tabs-wrapper">
              <div className="col-md-12">
                <Tabs defaultActiveKey={1} animation={false}>
                  <Tab eventKey={1} title="Model">
                    {model && this.renderState(model)}
                  </Tab>
                  <Tab eventKey={2} title="Training Data">
                    <ModelTrainingData inputData={model.input_data} />
                  </Tab>
                </Tabs>
              </div>
            </div>
          </div>
          <div className="col-md-4 right-sidebar">
            <h4>Recent Model Tests</h4>
            {isEmpty(model.tests)
              ? <p>The model has not been tested yet.</p>
              : <RecentModelTests tests={model.tests} />}
          </div>
        </div>
        {this.state.showModal === 'visibility' &&
          <ModalDialog title="Change Model Visibility"
            body={this.renderVisibilityToggle(model)}
            onHide={() => this.setState({showModal: undefined})}
          />}
        {this.state.showModal === 'algorithm' &&
          <ModalDialog title="Edit Algorithm"
            body={this.renderAlgorithmSelection(model.algorithm)}
            actionButton={
              <Button bsStyle="primary"
                disabled={!this.state.algorithm || (model.algorithm === this.state.algorithm)}
                onClick={this.handleSaveAndRetrain}
              >Save & Re-train the model</Button>}
            onHide={() => this.setState({showModal: undefined})}
          />}
      </div>
    );
  }
}

function select(state) {
  return {
    model: state.fetched.model,
    isFetching: state.fetched.isFetching,
    user: state.auth.user,
    isNotFound: state.fetched.isNotFound
  };
}

export default connect(select)(Model);
