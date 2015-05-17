'use strict';

var path = require('path'),
    gulp = require('gulp'),
    rename = require('gulp-rename'),
    render = require('gulp-nunjucks-render'),
    nunjucks = render.nunjucks;

module.exports.task = function (options) {
  return function () {
    nunjucks.configure(path.dirname(options.src), {
      watch: false
    });

    var context;
    if (options.context) {
      context = options.context();
    }

    return gulp.src(options.src)
      .pipe(render(context))
      .pipe(rename('index.html'))
      .pipe(gulp.dest(options.dest));
  };
};