import React from 'react';

export default class App extends React.Component {
  static propTypes = {
    children: React.PropTypes.object
  };

  render () {
    return (
      <div>
        <nav className="navbar navbar-default navbar-static-top">
          <div className="container-fluid">
            <div className="navbar-header">
              <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </button>
              <a className="navbar-brand" href="#">Neurolearn</a>
            </div>
            <div id="navbar" className="navbar-collapse collapse">
              <ul className="nav navbar-nav">
                <li className="active"><a id="navLinkHome"href="#">Train Model</a></li>
              </ul>
              <ul className="nav navbar-nav navbar-right navbar-user">
                <li><a href="#"><i className="fa fa-power-off"></i> <span>Log In</span></a></li>
              </ul>
            </div>
          </div>
        </nav>
        <div className="appcontent">
          {this.props.children}
        </div>
      </div>
    );
  }
}
