var gulp = require('gulp'); 

var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var annotate = require('gulp-ng-annotate');

gulp.task('lint', function() {
	return gulp.src(['js/*.js','js/*/*.js'])
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

gulp.task('sass', function() {
	return gulp.src('sass/all.scss')
		.pipe(sass({
			outputStyle: 'compressed',
			errLogToConsole: true
		}))
		.pipe(rename('gwp.css'))
		.pipe(gulp.dest('css'));
});

gulp.task('scripts', function() {
	return gulp.src(['js/*.js','js/*/*.js'])
		.pipe(concat('gwp.js'))
		.pipe(gulp.dest('dist'))
		.pipe(rename('gwp.min.js'))
		.pipe(annotate())
		.pipe(uglify())
		.pipe(gulp.dest('dist'))
});

gulp.task('watch', function() {
	gulp.watch(['js/*.js', 'js/*/*.js'], ['lint', 'scripts']);
	gulp.watch('sass/*.scss', ['sass']);
});

gulp.task('default', ['lint', 'sass', 'scripts', 'watch']);