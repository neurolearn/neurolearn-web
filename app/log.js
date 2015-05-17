'use strict';

var gutil = require('gulp-util'),
    dateformat = require('dateformat');

var start = new Date();

module.exports = function log() {
  var now = new Date();
  var absTime = '['+gutil.colors.grey(dateformat(now, 'HH:MM:ss'))+']';
  var relTime = '['+gutil.colors.grey(dateformat(new Date(new Date() - start), 'UTC:MM:ss.L'))+']';

  process.stdout.write(absTime + ' ' + relTime + ' ');
  console.log.apply(console, arguments);
};
