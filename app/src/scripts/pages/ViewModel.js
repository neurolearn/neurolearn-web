import moment from 'moment';
import zipWith from 'lodash/array/zipWith';
import isEmpty from 'lodash/lang/isEmpty';

import React, { PropTypes } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Button, ButtonToolbar, Tabs, Tab } from 'react-bootstrap';
import ScatterPlot from '../components/ScatterPlot';
import Spinner from '../components/Spinner';
import NSViewer from '../components/NSViewer';
import { loadItemDetail, deleteItem } from '../state/itemDetail';
import { setTestModel } from '../state/testModel';
import { algorithmNameMap } from '../constants/Algorithms';
import { summaryPropsNameMap, propOrder } from '../constants/SummaryProps';
import TaskStateLabel from '../components/TaskStateLabel';

import styles from './ViewModel.scss';

function scatterplotData(stats) {
  const {Y, yfit_xval, yfit_all} = stats;
  const yfit = yfit_xval || yfit_all;

  return zipWith(Y, yfit_xval, (acc, value) => {
        return { x: acc, y: value };
  });
}

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
      showMPLPlot: false
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

  renderCvSummaryProp(summary, propName) {
    return (
      <tr key={propName}>
        <th>{summaryPropsNameMap[propName]}</th>
        <td>{summary[propName].toFixed(2)}</td>
      </tr>
    );
  }

  renderCvSummary(summary) {
    return (
      <table style={{marginTop: 10}} className="table">
        <thead>
          <tr>
          {propOrder.map(propName => {
            return summary[propName]
            ? <th>{summaryPropsNameMap[propName]}</th>
            : false;
          })}
          </tr>
        </thead>
        <tbody>
          <tr>
          {propOrder.map(propName => {
            return summary[propName]
            ? <td>{summary[propName].toFixed(2)}</td>
            : false;
          })}
          </tr>
        </tbody>
      </table>
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

    const { summary } = model.output_data;
    const { algorithm, cv, label } = model.input_data;

    const spData = [{
        label: label.name,
        values: scatterplotData(model.output_data.stats)
    }];

    return (
      <div>
        <div className="row weightmap">
          <div className="col-md-6">
            <h3>Weightmap</h3>
            <img style={{marginTop: 15}} src={`/media/${model.id}/${model.output_data.glassbrain}`} className="img-responsive"/>
            <div className="btn-toolbar" style={{marginTop: 10}}>
              <a className="btn btn-default" href={weightmapUrl}>Open Interactive Viewer</a>
              <a className="btn btn-link" href={weightmapUrl}><i className="fa fa-download"></i> Download NIfTI file</a>
            </div>
          </div>

          <div className="col-md-6">
            <h4></h4>
          </div>
        </div>

        <div className="row weightmap">
          <div className='col-md-12' style={{marginTop: 20}}>
            <h3>Cross Validation</h3>
            <p>Method: <strong>{cv.type}</strong></p>

            {this.renderCvSummary(summary)}

            <h4>Actual vs. Predicted</h4>
            <ScatterPlot
              data={spData}
              width={500}
              height={400}
              margin={{top: 10, bottom: 30, left: 30, right: 0}}
              xAxis={{label: label.name}}
              yAxis={{label: `Predicted ${label.name}`}}
            />
            {!this.state.showMPLPlot &&
            <Button onClick={() => this.setState({showMPLPlot: true})}>
              Debug: Show matplotlib Scatterplot
            </Button>
            }
            {this.state.showMPLPlot &&
              <div>
              <hr />
              <img src={`/media/${model.id}/${model.output_data.scatterplot}`}/>
              <Button onClick={() => this.setState({showMPLPlot: false})}>
                Hide matplotlib Scatterplot
              </Button>
              </div>
            }
          </div>
        </div>

        <div className="row weightmap">
          <div className='col-md-12' style={{marginTop: 20}}>
              <p>Training duration: {Math.floor(model.output_data.duration) + ' sec'}</p>
          </div>
        </div>

        <div className="row">
          {false &&
          <div className="col-md-6 viewer-wrapper">
            <NSViewer images={images} onImagesLoaded={this.handleImagesLoaded.bind(this)}/>
            <ReactCSSTransitionGroup transitionName="overlay"
                                     transitionEnterTimeout={100}
                                     transitionLeaveTimeout={100}>
              {this.state.loadingImages && [<div className="overlay">&nbsp;</div>,
                                            <Spinner opts={{position: 'absolute'}} />]}
            </ReactCSSTransitionGroup>
            <div className='download' style={{marginTop: 20}}>
              <a className="btn btn-default" href={weightmapUrl}>Download the Weight Map</a>
            </div>
          </div>
          }
        </div>
      </div>
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
                <img src="http://localhost:3000/media/2/glassbrain.png"/>
                <p><a href={`http://neurovault.org/images/${row.id}/`}>Title {row.id}</a></p>
              </td>
              <td>{row.target}</td>
            </tr>)}
        </tbody>
      </table>
    )
  }

  renderRecentModelTests(tests) {
    return (
      <div>
        {tests.map(test => <div>
            <Link to={`/tests/${test.id}`}>{test.name}</Link>
            <p>
            {test.images_count} {this.pluralize(test.images_count, 'image', 'images')} • {test.mean_correlation} mean r
            </p>
          </div>)}
      </div>
    );
  }

  handleDelete(modelId) {
    const { router } = this.context;

    this.props.dispatch(deleteItem(`/api/models/${modelId}`,
      () => router.push('/dashboard/models')
    ));
  }

  pluralize(n, singular, plural) {
    return (n !== 1) ? plural : singular;
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
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quam velit, vulputate eu pharetra nec, mattis ac neque. Duis vulputate commodo lectus, ac blandit elit tincidunt id.</p>
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
                    <td>{model.input_data.data.length} {this.pluralize(model.input_data.data.length, 'image', 'images')}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="col-md-4 right-sidebar">
            <h4>Recent Model Tests</h4>
            {isEmpty(model.tests)
              ? <p>The model has not been tested yet.</p>
              : this.renderRecentModelTests(model.tests)}
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
