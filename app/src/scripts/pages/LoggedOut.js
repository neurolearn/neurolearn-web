import React from 'react';
import { Link } from 'react-router';

import Footer from '../components/Footer';

const Stats = ({stats}) => (
  <p className="lead">There are currently <Link to="/explore/models">{stats.models_count} models</Link> and <Link to="/explore/tests">{stats.tests_count} tests</Link> being shared.</p>
);

const LoggedOut = ({stats}) => (
  <div>
    <div className="hero">
      <h1 className="hero-header">Neurolearn</h1>
      <p className="lead">A web platform for analyzing neuroimaging data stored in <a href="http://neurovault.org">NeuroVault</a> using machine-learning tools.</p>
    </div>
    <div className="row">
      <div className="col-md-6">
        <p>The basic concept is to provide an easy to use interface to allow researchers to develop predictive brain models of psychological states by applying multivariate decoding methods to open source data publicly shared via NeuroVault.</p>
        <p>These predictive brain models can be shared with other researchers and also tested on any data available on NeuroVault.  This can be useful for assessing the sensitivity and specificity of the brain pattern to other psychological states.</p>
      </div>
      <div className="col-md-6">
        <p>Ultimately, we hope that this tool will contribute to accelerating the development and validation cycle of brain-based markers of psychological states and will aid in promoting a more open and transparent study of the human mind.</p>
      </div>
    </div>
    <div className="text-center" style={{paddingTop: 20, paddingBottom: 20}}>
    { stats && <Stats stats={stats} /> }
    </div>
    <Footer />
  </div>
);

export default LoggedOut;
