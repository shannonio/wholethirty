/*jslint node: true */
var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    karma = require('karma').server,
    stylish = require('jshint-stylish'),
    connect = require('gulp-connect'),
    sass = require('gulp-sass'),
    sassGlob = require('gulp-sass-glob');

var MAIN_STYLE_SRC = 'app.scss';

var JS_SRC = ['partial/**/*.js', 'directive/**/*.js', 'service/**/*.js', 'filter/**/*.js'];
var STYLE_SRC = [MAIN_STYLE_SRC, 'partial/**/*.scss', 'directive/**/*.scss', 'styles/**/*.scss'];
var TMPL_SRC = ['partial/**/*.html', 'directive/**/*.html', 'service/**/*.html', 'filter/**/*.html'];

/**
 * Run test once and exit
 */
gulp.task('testall', function (done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true,
    browsers: ['Chrome', 'PhantomJS']
  }, done);
});

gulp.task('test', function(done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done);
});

gulp.task('testdebug', function (done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js',
    browsers: ['Chrome']
  }, done);
});

gulp.task('jshint', ['test'], function() {
  return gulp.src(JS_SRC)
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter(stylish));
});

gulp.task('serve', function() {
  connect.server({
    livereload: true
  });
});

gulp.task('html', function () {
  gulp.src(TMPL_SRC)
    .pipe(connect.reload());
});

gulp.task('sass', function () {
  gulp.src(MAIN_STYLE_SRC)
    .pipe(sassGlob())
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./css'));
});

gulp.task('watch', function() {
  gulp.watch(TMPL_SRC, ['test', 'jshint', 'html']);
  gulp.watch(STYLE_SRC, ['test', 'sass', 'html']);
  gulp.watch(JS_SRC, ['test', 'jshint', 'html']);
});

gulp.task('default', ['test', 'jshint', 'serve', 'watch']);
