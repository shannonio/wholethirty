/*jslint node: true */
var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    karma = require('karma').server,
    stylish = require('jshint-stylish'),
    connect = require('gulp-connect'),
    sass = require('gulp-sass');
    sassGlob = require('gulp-sass-glob');
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    dom = require('gulp-html-replace'),
    ngHtml2js = require("gulp-ng-html2js"),
    ngmin = require('gulp-ng-annotate'),
    htmlmin = require('gulp-htmlmin'),
    cssmin = require('gulp-cssmin'),
    packagejson = require('./package.json'),
    streamqueue = require('streamqueue'),
    rimraf = require('rimraf'),
    rename = require('gulp-rename'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    domSrc = require('gulp-dom-src');


var MAIN_STYLE_SRC = 'app.scss';

var JS_SRC = ['partial/**/*.js', 'directive/**/*.js', 'service/**/*.js', 'filter/**/*.js'];
var STYLE_SRC = [MAIN_STYLE_SRC, 'partial/**/*.scss', 'directive/**/*.scss', 'styles/**/*.scss'];
var TMPL_SRC = ['partial/**/*.html', 'directive/**/*.html', 'service/**/*.html', 'filter/**/*.html'];
var DIST_DEST = 'dist/';

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

gulp.task('css', function() {
    gulp.src(MAIN_STYLE_SRC)
        .pipe(sassGlob())
        .pipe(sass())
        .pipe(cssmin({keepSpecialComments: 0}))
        .pipe(rename('webapp.full.css'))
        .pipe(gulp.dest(DIST_DEST+'css'));
});

gulp.task('js', function() {

    var templateStream = gulp.src(TMPL_SRC)
        .pipe(htmlmin({
          removeComments: true,
          conservativeCollapse: true,
          keepClosingSlash: true,
          preserveLineBreaks: true
        }))
        .pipe(ngHtml2js({
            moduleName: packagejson.name
        }));

    var jsStream = domSrc({file:'index.html',selector:'script[data-build!="exclude"]',attribute:'src'});

    var combined = streamqueue({ objectMode: true });

    combined.queue(jsStream);
    combined.queue(templateStream);

    return combined.done()
        .pipe(concat('webapp.full.js'))
        .pipe(ngmin())
        .pipe(uglify())
        .pipe(gulp.dest(DIST_DEST+'js'));
});

gulp.task('indexHtml', function() {
    return gulp.src('index.html')
        .pipe(dom({
            'css': {
              src: '/css/webapp.full.css',
              tpl: '<link rel="stylesheet" href="%s" />'
            },
            'js': '/js/webapp.full.js'
        }))
        .pipe(htmlmin({
          removeComments: true,
          conservativeCollapse: true,
          keepClosingSlash: true,
          preserveLineBreaks: true
        }))
        .pipe(gulp.dest(DIST_DEST));
});

gulp.task('images', function(){
    return gulp.src('img/**')
        .pipe(imagemin())
        .pipe(gulp.dest(DIST_DEST+'img'));
});

gulp.task('build', ['test', ''])

gulp.task('default', ['test', 'jshint', 'serve', 'watch']);
