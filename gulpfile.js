var gulp = require('gulp');
var browserSync = require('browser-sync');
var jshint = require('gulp-jshint');
//var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var tap = require('gulp-tap');
//var gutil = require('gulp-util');
//var minify = require('gulp-minify');

var sassOptions = {
  errLogToConsole: true,
  outputStyle: 'expanded'
};

// Definimos o diretorio dos arquivos para evitar repetição futuramente
var html_files = "./res/html/*.html";
var js_files = "./res/js/*.js";
var scss_files = "./res/scss/*.scss";
var scss_index =  "./res/scss/app.scss";


gulp.task('html', function() {

	gulp.src(html_files)
	.pipe(concat('index.html'))
	.pipe(gulp.dest('./www/'));

});

gulp.task('js', function() {

	gulp.src(js_files)
	.pipe(concat('app.js'))
	//.pipe(minify({compress:}))
	.pipe(gulp.dest('./www/'));

});



gulp.task('styles', function() {
	return gulp
  .src(scss_index)
	.pipe(sass(sassOptions).on('error', sass.logError))
  .pipe(autoprefixer())
	//.pipe(uglify())
	.pipe(gulp.dest('./www/'))
  .pipe( browserSync.reload({ stream:true }) );
	});


// this task utilizes the browsersync plugin
// to create a dev server instance
// at http://localhost:9000
gulp.task('serve', function(done) {

  browserSync({
    online: true,
    open: false,
    port: 9000,
    server: {
      baseDir: ['./www'],
      middleware: function(req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        next();
      }
    }
  }, done);

});


gulp.task('default', ['html', 'styles', 'js', 'serve'], function() {

  gulp.watch(html_files, ['html', browserSync.reload] );

  gulp.watch(js_files, ['js', browserSync.reload] );

  gulp.watch(scss_files, ['styles', browserSync.reload] );

});
