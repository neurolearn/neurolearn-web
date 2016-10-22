/* @flow */

import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { fetchJSON } from '../../../state/fetched';
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

  renderItemList(itemList) {
    return itemList.map(item => (
      <div className="col-sm-4">
        {item.thumbnailUrl &&
          <a href={item.url}><img className="img-responsive glassbrain" src={item.thumbnailUrl} /></a>}
        <a href={item.url}><h4>{item.name}</h4></a>
        <p className="gray">{item.meta}</p>
      </div>
    ));
  }

  render() {
    const { fetched: { stats } } = this.props;
    const modelList = [
      {
        thumbnailUrl: '/media/66/glassbrain.png',
        url: '/models/66',
        name: 'Predict Image Brightness',
        meta: '100 images • Ridge • Training label: avg_brightness'
      },
      {
        thumbnailUrl: '/media/66/glassbrain.png',
        url: '/models/66',
        name: 'Predict Image Brightness',
        meta: '100 images • Ridge • Training label: avg_brightness'
      },
      {
        thumbnailUrl: '/media/66/glassbrain.png',
        url: '/models/66',
        name: 'Predict Image Brightness',
        meta: '100 images • Ridge • Training label: avg_brightness'
      }
    ];
    const testList = [
      {
        url: '/tests/66',
        name: 'The integration of negative affect, pain and cognitive control in the cingulate cortex',
        meta: '3 images • 0.13 mean r'
      },
      {
        url: '/tests/66',
        name: 'The integration of negative affect, pain and cognitive control in the cingulate cortex',
        meta: '3 images • 0.13 mean r'
      },
      {
        url: '/tests/66',
        name: 'The integration of negative affect, pain and cognitive control in the cingulate cortex',
        meta: '3 images • 0.13 mean r'
      }
    ];

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
        <div className="container" style={{paddingTop: 70}}>
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
          <div className="container subsection">
            <h3>Recent Models</h3>
            <div className="row">
              {this.renderItemList(modelList)}
            </div>
            <div className="section-view-more light-border-bottom">
              <a href="">View All Models</a>
            </div>
          </div>

          <div className="container subsection">
            <h3>Recent Tests</h3>
            <div className="row">
              {this.renderItemList(testList)}
            </div>
            <div className="section-view-more">
              <a href="">View All Tests</a>
            </div>
          </div>
        </div>
        <footer className="homepage-footer">
          <div className="container">
            <p>Created and maintained by Luke Chang, Tor Wager, and Anton Burnashev.</p>
            <p>Supported by NIH award R01DA035484-02S1
            {' '}
            and a <a href="http://neukom.dartmouth.edu/">Neukom CompX award</a>.
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
