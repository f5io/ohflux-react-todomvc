var gulp = require('gulp'),
	path = require('path'),
	browserify = require('browserify'),
	babelify = require('babelify'),
	uglifyify = require('uglifyify'),
	sass = require('gulp-sass'),
	prefix = require('gulp-autoprefixer'),
	minify = require('gulp-minify-css'),
	source = require('vinyl-source-stream');

gulp.task('scripts', function() {
	return browserify({ debug: true })
		.transform(babelify)
		.transform({
			global: true,
			mangle: false
		}, 'uglifyify')
		.require('./src/app.js', { entry: true })
		.bundle()
		.on('error', function(err) {
			console.error(err.toString());
			this.emit('end');
		})
		.pipe(source('prod.min.js'))
		.pipe(gulp.dest('./public/assets/scripts'));
});

gulp.task('styles', function() {
	return gulp.src(['./scss/**/*.scss'])
		.pipe(sass({
			sourceComments: 'map'
		}))
		.pipe(prefix({
			browsers: ['> 1%', 'last 3 versions', 'ie 8']
		}))
		.pipe(minify())
		.pipe(gulp.dest('./public/assets/css'));
});

gulp.task('watch', function() {
	gulp.watch('src/**/*.+(js|jsx)', ['scripts']);
	gulp.watch('scss/**/*.scss', ['styles']);
});

gulp.task('default', ['scripts', 'styles', 'watch']);
