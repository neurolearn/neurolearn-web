import React from 'react';
import { Link } from 'react-router';

const LoggedOut = () => (
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
      <p className="lead">There are currently <Link to="/explore/models">12 models</Link> and <Link to="/explore/tests">9 tests</Link> being shared.</p>
    </div>
    <hr/>
    <footer className="footer text-center">
      <p>Created and maintained by Luke Chang, Tor Wager, and Anton Burnashev. Supported by NIH award R01DA035484-02S1</p>
    </footer>
  </div>
);


export default LoggedOut;
