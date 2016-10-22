/* @flow */

import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { fetchJSON } from '../../../state/fetched';
import Footer from '../../../components/Footer';
import { authLink } from '../../../utils';

import classes from './Home.scss';

const Stats = (
  { stats } : {
    stats: {
      models_count: number,
      tests_count: number
    }
  }
) => (
  <p className="lead">
    There are currently <Link to="/explore/models">{stats.models_count} models</Link>{' '}
    and <Link to="/explore/tests">{stats.tests_count} tests</Link> being shared.
  </p>
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

    dispatch(fetchJSON('/api/stats', 'stats'));
  }

  render() {
    const { fetched: { stats } } = this.props;
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
        <div className="container" style={{paddingTop: 70, borderBottom: '1px solid #eee'}}>
          <div className="row">
            <div className="col-md-6">
              <p>The basic concept is to provide an easy to use interface to allow researchers
                 to develop predictive brain models of psychological states by applying
                 multivariate decoding methods to open source data publicly shared via NeuroVault.
              </p>
              <p>These predictive brain models can be shared with other researchers and also
                 tested on any data available on NeuroVault.  This can be useful for assessing
                 the sensitivity and specificity of the brain pattern to other psychological states.
              </p>
            </div>
            <div className="col-md-6">
              <p>Ultimately, we hope that this tool will contribute to accelerating the development
                 and validation cycle of brain-based markers of psychological states and will aid
                 in promoting a more open and transparent study of the human mind.
              </p>
            </div>
          </div>
          <div className="text-center" style={{paddingTop: 20, paddingBottom: 20}}>
          {stats && <Stats stats={stats} />}
          </div>
        </div>

        <div className="section">
          <h2 className="section-title">Explore Neurolearn</h2>
          <div className="container">
            <h3>Recent Models</h3>
            <div className="row">
              <div className="col-sm-4">
                <a href="/models/66"><img className="img-responsive" src="http://localhost:3000/media/66/glassbrain.png" /></a>
                <a href="/models/66"><h4>Predict Image Brightness</h4></a>
                <p>100 images • Ridge • Training label: avg_brightness</p>
              </div>

              <div className="col-sm-4">
                <a href="/models/66"><img className="img-responsive" src="http://localhost:3000/media/66/glassbrain.png" /></a>
                <a href="/models/66"><h4>Predict Image Brightness</h4></a>
                <p>100 images • Ridge • Training label: avg_brightness</p>
              </div>

              <div className="col-sm-4">
                <a href="/models/66"><img className="img-responsive" src="http://localhost:3000/media/66/glassbrain.png" /></a>
                <a href="/models/66"><h4>Predict Image Brightness</h4></a>
                <p>100 images • Ridge • Training label: avg_brightness</p>
              </div>
            </div>
            <a href="" className="section-view-more">View More Models</a>
          </div>

          <div className="container">
            <h3>Recent Tests</h3>
            <div className="row">
              <div className="col-sm-4">
                <a href="/models/66"><h4>The integration of negative affect, pain and cognitive control in the cingulate cortex</h4></a>
                <p>3 images • 0.13 mean r</p>
              </div>

              <div className="col-sm-4">
                <a href="/models/66"><h4>Functional Specialization and Flexibility in Human Association Cortex</h4></a>
                <p>3 images • 0.13 mean r</p>
              </div>

              <div className="col-sm-4">
                <a href="/models/66"><h4>Single Subject Thermal Pain, Functional Specialization and Flexibility in Human Association Cortex</h4></a>
                <p>3 images • 0.13 mean r</p>
              </div>
            </div>
            <a href="" className="section-view-more">View More Tests</a>
          </div>

        </div>
        <footer className="homepage-footer">
          <div className="container">
            <p>Created and maintained by Luke Chang, Tor Wager, and Anton Burnashev.</p>
            <p>Supported by NIH award R01DA035484-02S1 and a <a href="http://neukom.dartmouth.edu/">Neukom CompX award</a>.</p>
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
