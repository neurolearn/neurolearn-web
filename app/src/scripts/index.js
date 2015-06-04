'use strict';

require('console-shim');
require('promise.prototype.finally');

require('index.css');
require('handsontable.full.css');

var React = require('react');
var App = require('./App');

function render () {
  var route = window.location.hash.substr(1);
  React.render(<App route={route} />,
    document.getElementById('root'));

}

window.addEventListener('hashchange', render);
render();
