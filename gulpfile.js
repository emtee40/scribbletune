var gulp = require('gulp');
var tape = require('gulp-tape');
var istanbul = require('gulp-istanbul');
var babel = require('gulp-babel');
var eslint = require('gulp-eslint');

gulp.task('lint', function () {
	// ESLint ignores files with "node_modules" paths.
	// So, it's best to have gulp ignore the directory as well.
	// Also, Be sure to return the stream from the task;
	// Otherwise, the task may end before the stream has finished.
	return gulp.src(['src/*.js','!node_modules/**'])
		// eslint() attaches the lint output to the "eslint" property
		// of the file object so it can be used by other modules.
		.pipe(eslint())
		// eslint.format() outputs the lint results to the console.
		// Alternatively use eslint.formatEach() (see Docs).
		.pipe(eslint.format())
		// To have the process exit with an error code (1) on
		// lint error, return the stream and pipe to failAfterError last.
		.pipe(eslint.failAfterError());
});

gulp.task('build', function () {
	return gulp.src(['src/*.js'])
		.pipe(babel({
			presets: ['es2015']
		}))
		.pipe(gulp.dest('dest'))
});

gulp.task('pre-coverage', function() {
	return gulp.src(['dest/*.js'])
		.pipe(istanbul())
		// This overwrites `require` so it returns covered files
		.pipe(istanbul.hookRequire());
});

gulp.task('test-with-coverage', ['pre-coverage'], function() {
	return gulp.src('test/*.js')
		.pipe(tape())
		.pipe(istanbul.writeReports());
});

gulp.task('default', ['lint', 'test-with-coverage']);