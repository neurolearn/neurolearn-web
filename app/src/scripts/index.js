'use strict';

require('console-shim');
require('promise.prototype.finally');

require('index.css');
require('handsontable.full.css');

var React = require('react');
var App = require('./App');

React.render(<App/>,
    document.getElementById('root'));
