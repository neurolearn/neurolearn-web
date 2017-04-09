/* @flow */

import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { fetchJSON } from '../../../state/fetched';
import { authLink, pluralize } from '../../../utils';
import { algorithmNameMap } from '../../../constants/Algorithms';

import { trunc } from 'lodash';

import classes from './Home.scss';

import inputDataImg from '../../../static/images/input-data.png';
import trainingLabelImg from '../../../static/images/training-label.png';
import modelTestImg from '../../../static/images/model-test.png';

const MAX_CHARS = 120;

const truncate = (str) =>
  trunc(str, {
    length: MAX_CHARS,
    separator: /,?\.* +/,
    omission: '…'
  }
);

class HomePage extends React.Component {
  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    fetched: PropTypes.object,
    auth: PropTypes.object
  };

  componentWillMount() {
    const { dispatch } = this.props;

    dispatch(fetchJSON('/api/latest', 'latest'));
  }

  renderItemList(itemList) {
    return itemList.map(item => (
      <div className="col-sm-4" key={item.id}>
        {item.thumbnailUrl &&
          <Link to={item.url}>
            <img className="img-responsive glassbrain" src={item.thumbnailUrl} />
          </Link>}
        <Link to={item.url}><h4>{item.name}</h4></Link>
        <p className="gray">{item.meta}</p>
      </div>
    ));
  }

  renderCallToActionButton(user) {
    const classList = 'btn btn-outline-inverse btn-lg';
    return user
    ? <Link to="/dashboard/models" className={classList}>Go to the Dashboard</Link>
    : <a href={authLink(window.location)} className={classList}>Sign in to start</a>;
  }

  render() {
    const { fetched: { latest }, auth } = this.props;

    const modelList = latest && latest.models && latest.models.map(item => {
      return {
        id: item.id,
        name: truncate(item.name),
        url: `/models/${item.id}`,
        thumbnailUrl: `/media/${item.id}/glassbrain.png`,
        meta: `${item.images_count} ${pluralize(item.images_count, 'image', 'images')} ` +
              ` • ${algorithmNameMap[item.algorithm]} • ${item.label_name}`
      };
    });

    const testList = latest && latest.tests && latest.tests.map(item => {
      return {
        id: item.id,
        name: truncate(item.name),
        url: `/tests/${item.id}`,
        meta: `${item.images_count} ${pluralize(item.images_count, 'image', 'images')} ` +
              ` • ${item.mean_correlation} mean r`
      };
    });

    return (
      <div>
        <div className={classes.masthead}>
          <div className="container">
            <h1>Neurolearn</h1>
            <p className="lead">A web platform for analyzing neuroimaging data stored
              in <a target="_blank" href="http://neurovault.org">NeuroVault</a> using machine-learning tools.
            </p>
            <p className="lead">
              {this.renderCallToActionButton(auth.user)}
            </p>
          </div>
        </div>

        <div className="section light-border-bottom" style={{paddingTop: 34, paddingBottom: 40}}>
          <h2 className="section-title">How it works</h2>
          <div className="container how-to">
            <div className="row">
              <div className="col-md-4">
                <h2 className="subsection-title">Search & select neuroimaging data</h2>
                <p className="lead">Search NeuroVault collections and select images.</p>
              </div>
              <div className="col-md-8">
                <div className="browser-title-bar">
                  <svg width="123" height="12" viewBox="9 6 246 24" xmlns="http://www.w3.org/2000/svg">
                    <g fill="none" fillRule="evenodd" transform="translate(9 6)">
                      <circle fill="#fff" cx="6" cy="10" r="6"></circle>
                      <circle fill="#fff" cx="25" cy="10" r="6"></circle>
                      <circle fill="#fff" cx="45" cy="10" r="6"></circle>
                    </g>
                  </svg>
                </div>
                <img
                  src={inputDataImg}
                  alt="A screenshot of the Input Data page"
                  className="img-responsive browser-screenshot"
                />
              </div>
            </div>
          </div>
          <div className="container how-to">
            <div className="row">
              <div className="col-md-4 col-md-push-8">
                <h2 className="subsection-title">Train model using cross-validation</h2>
                <p className="lead">
                  Train a brain model that can predict or classify an outcome of your choice.
                </p>
              </div>
              <div className="col-md-8 col-md-pull-4">
                <div className="browser-title-bar">
                  <svg width="123" height="12" viewBox="9 6 246 24" xmlns="http://www.w3.org/2000/svg">
                    <g fill="none" fillRule="evenodd" transform="translate(9 6)">
                      <circle fill="#fff" cx="6" cy="10" r="6"></circle>
                      <circle fill="#fff" cx="25" cy="10" r="6"></circle>
                      <circle fill="#fff" cx="45" cy="10" r="6"></circle>
                    </g>
                  </svg>
                </div>
                <img
                  src={trainingLabelImg}
                  alt="A screenshot of the Training Label page"
                  className="img-responsive browser-screenshot"
                />
              </div>
            </div>
          </div>
          <div className="container how-to">
            <div className="row">
              <div className="col-md-4">
                <h2 className="subsection-title">Test your model</h2>
                <p className="lead">
                  Evaluate the sensitivity, specificity,
                  and generalizability of your model using
                  other images from NeuroVault.
                </p>
              </div>
              <div className="col-md-8">
                <div className="browser-title-bar">
                  <svg width="123" height="12" viewBox="9 6 246 24" xmlns="http://www.w3.org/2000/svg">
                    <g fill="none" fillRule="evenodd" transform="translate(9 6)">
                      <circle fill="#fff" cx="6" cy="10" r="6"></circle>
                      <circle fill="#fff" cx="25" cy="10" r="6"></circle>
                      <circle fill="#fff" cx="45" cy="10" r="6"></circle>
                    </g>
                  </svg>
                </div>
                <img
                  src={modelTestImg}
                  alt="A screenshot of the Model Test page"
                  className="img-responsive browser-screenshot"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="section" style={{marginTop: 56}}>
          <h2 className="section-title">Explore Neurolearn</h2>
          <div className="container subsection">
            <h3>Recent Models</h3>
            <div className="row">
              {modelList && this.renderItemList(modelList)}
            </div>
            <div className="section-view-more light-border-bottom">
              <Link to="/explore/models">View All Models</Link>
            </div>
          </div>

          <div className="container subsection">
            <h3>Recent Tests</h3>
            <div className="row">
              {testList && this.renderItemList(testList)}
            </div>
            <div className="section-view-more">
              <Link to="/explore/tests">View All Tests</Link>
            </div>
          </div>
        </div>
        {!auth.user &&
          <div className="section bottom-cta">
            <div className="container">
              <span>Ready to train a new model?</span>
              <a href={authLink(window.location)} className="btn btn-primary btn-lg">Sign in to start</a>
            </div>
          </div>
        }
        <footer className="homepage-footer">
          <div className="container">
            <p>Created and maintained by Luke Chang, Tor Wager, and Anton Burnashev.</p>
            <p>
              Supported by NIH award R01DA035484-02S1
            {' '}
            and a
            {' '}
              <a href="http://neukom.dartmouth.edu/">Neukom CompX award</a>.
            </p>
          </div>
        </footer>
      </div>
    );
  }
}

function select(state) {
  return {
    auth: state.auth,
    fetched: state.fetched
  };
}

export default connect(select)(HomePage);
