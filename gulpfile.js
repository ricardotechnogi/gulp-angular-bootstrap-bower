var gulp = require('gulp');
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var webserver = require('gulp-webserver');
var concat = require('gulp-concat');

var paths = {
  sass: ['./scss/**/*.scss'],
  scripts: ['./src/scripts/**/*.js']
};


gulp.task('sass',function(done) {
  gulp.src('./scss/app.scss')
    .pipe(sass())
    .pipe(gulp.dest('./src/styles/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./src/build/css/'))
    .on('end', done);
});

gulp.task('browserify',['lint'] ,function() {
  var bundleStream = browserify('./src/scripts/app.js').bundle();
  bundleStream
    .pipe(source('app.js'))
    .pipe(gulp.dest('./src/build/js'));
});

gulp.task('lint', function () {
  return gulp.src(paths.scripts)
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'));
});


gulp.task('watch', function () {
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.scripts, ['browserify']);
});

gulp.task('webserver', function () {
  gulp.src('src')
    .pipe(webserver({
      livereload: true,
      directoryListing: false,
      open: true,
      defaultFile: 'index.html'
    }));
});


gulp.task('start', ['sass','browserify','watch', 'webserver']);

