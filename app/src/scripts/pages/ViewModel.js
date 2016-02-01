import moment from 'moment';
import zipWith from 'lodash/array/zipWith';

import React, { PropTypes } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { connect } from 'react-redux';
import { Button, ButtonToolbar } from 'react-bootstrap';
import ScatterPlot from '../components/ScatterPlot';
import Spinner from '../components/Spinner';
import NSViewer from '../components/NSViewer';
import { loadItemDetail, deleteItem } from '../state/itemDetail';
import { setTestModel } from '../state/testModel';
import { algorithmNameMap } from '../constants/Algorithms';
import { summaryPropsNameMap, propOrder } from '../constants/SummaryProps';

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
    this.props.dispatch(loadItemDetail(`/api/models/${parseInt(id)}`));
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

  renderSummaryProp(summary, propName) {
    return (
      <tr key={propName}>
        <th>{summaryPropsNameMap[propName]}</th>
        <td>{summary[propName].toFixed(2)}</td>
      </tr>
    );
  }

  renderSummary(summary) {
    return (
      <table style={{marginTop: 10}} className="table">
        <tbody>
        {propOrder.map(propName => {
          return summary[propName]
          ? this.renderSummaryProp(summary, propName)
          : false;
        })}
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
      <div className={styles.root}>
        <table className="table">
          <thead>
            <tr>
              <th>Algorithm</th>
              <th>Cross-validation Type</th>
              <th>Training Duration</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{algorithmNameMap[algorithm]}</td>
              <td>{cv.type}</td>
              <td>{Math.floor(model.output_data.duration) + ' sec'}</td>
              <td>
                  <span className="datetime">{moment(model.created).fromNow()}</span>
              </td>
            </tr>
          </tbody>
        </table>

        <div className="row">
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

          <div className='col-md-6' style={{marginTop: 20}}>
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
            {this.renderSummary(summary)}
          </div>
        </div>

      </div>
    );
  }

  handleDelete(modelId) {
    const { router } = this.context;

    this.props.dispatch(deleteItem(`/api/models/${modelId}`,
      () => router.transitionTo('/dashboard/models')
    ));
  }

  handleTestModel(model) {
    const { router } = this.context;

    this.props.dispatch(setTestModel(model));
    router.transitionTo('/tests/new');
  }

  render() {
    const { itemDetail, user } = this.props;
    const model = itemDetail.item;

    if (!model || itemDetail.isFetching) {
      return <div>Loading model...</div>;
    }

    const userIsOwner = (model && user && model.user.id === user.user_id);

    return (
      <div>
        <div className="page-header">
          <ButtonToolbar className="pull-right">
            {user && model.state === 'success' &&
              <Button bsStyle="primary"
                      onClick={() => this.handleTestModel(model)}>Test Model</Button>}
            {userIsOwner &&
              <Button bsStyle="danger"
                      onClick={() => this.handleDelete(model.id)}>Delete</Button>}
          </ButtonToolbar>
          <h1>{model && model.name}</h1>
        </div>
        { model && this.renderState(model) }
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
