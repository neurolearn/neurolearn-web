/* @flow */

import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { fetchJSON } from '../../../state/fetched';
import { authLink, pluralize } from '../../../utils';
import { algorithmNameMap } from '../../../constants/Algorithms';

import { trunc } from 'lodash';

import classes from './Home.scss';

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
    fetched: PropTypes.object
  };

  componentWillMount() {
    const { dispatch } = this.props;

    dispatch(fetchJSON('/api/latest', 'latest'));
  }

  renderItemList(itemList) {
    return itemList.map(item => (
      <div className="col-sm-4">
        {item.thumbnailUrl &&
          <Link to={item.url}>
            <img className="img-responsive glassbrain" src={item.thumbnailUrl} />
          </Link>}
        <Link to={item.url}><h4>{item.name}</h4></Link>
        <p className="gray">{item.meta}</p>
      </div>
    ));
  }

  render() {
    const { fetched: { latest } } = this.props;

    const modelList = latest && latest.models && latest.models.map(item => {
      return {
        name: truncate(item.name),
        url: `/models/${item.id}`,
        thumbnailUrl: `/media/${item.id}/glassbrain.png`,
        meta: `${item.images_count} ${pluralize(item.images_count, 'image', 'images')} ` +
              ` • ${algorithmNameMap[item.algorithm]} • ${item.label_name}`
      };
    });

    const testList = latest && latest.tests && latest.tests.map(item => {
      return {
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
              in <a href="http://neurovault.org">NeuroVault</a> using machine-learning tools.
            </p>
            <p className="lead">
              <a href={authLink(window.location)} className="btn btn-outline-inverse btn-lg">Sign in to start</a>
            </p>
          </div>
        </div>

        <div className="section light-border-bottom" style={{paddingTop: 34, paddingBottom: 40}}>
          <h2 className="section-title">How it works</h2>
          <div className="container how-to">
            <div className="row">
              <div className="col-md-4">
                <h2 className="subsection-title">Search & Select</h2>
                <p className="lead">Search NeuroVault collections and select images.</p>
              </div>
              <div className="col-md-8">
                <div className="browser-handle"></div>
                <img className="img-responsive" style={{border: '1px solid #DBE5EB'}} src="/input-data.png" />
              </div>
            </div>
          </div>
          <div className="container how-to">
            <div className="row">
              <div className="col-md-8">
                <div className="browser-handle"></div>
                <img className="img-responsive" style={{border: '1px solid #DBE5EB'}} src="/training-label.png" />
              </div>
              <div className="col-md-4">
                <h2 className="subsection-title">Train & <br />Cross-Validate</h2>
                <p className="lead">
                  Choose what you’d like to predict or classify.
                  Run the training and see how the model performs.
                </p>
              </div>
            </div>
          </div>
          <div className="container how-to">
            <div className="row">
              <div className="col-md-4">
                <h2 className="subsection-title">Test your model</h2>
                <p className="lead">Pick any other set of images from NeuroVault and test the model on it.</p>
              </div>
              <div className="col-md-8">
                <div className="browser-handle"></div>

                <img className="img-responsive" style={{border: '1px solid #DBE5EB'}} src="/model-test.png" />
              </div>
            </div>
          </div>
        </div>

        <div className="section" style={{marginTop: 40}}>
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
  return state;
}

export default connect(select)(HomePage);
