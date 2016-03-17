// --------------------------------------------------------------------
// Plugins
// --------------------------------------------------------------------

var gulp 					= require('gulp'),
		sass 					= require('gulp-sass'),
		concat 				= require('gulp-concat'),
		watch 				= require('gulp-watch'),
		plumber 			= require('gulp-plumber'),
		minify_css 		= require('gulp-minify-css'),
		uglify 				= require('gulp-uglify'),
		sourcemaps 		= require('gulp-sourcemaps'),
		prefix			  = require('gulp-autoprefixer'),
		imagemin 			= require('gulp-imagemin'),
		jshint 				= require('gulp-jshint'),
		pngquant 			= require('imagemin-pngquant'),
		browserSync		= require('browser-sync');


// --------------------------------------------------------------------
// Settings
// --------------------------------------------------------------------

var src = {
		sass: 	 	"app/sass/**/*",
		js: 		 	"app/js/**/*.js",
		img: 		 	"app/img/**/*",
		html: 	 	"app/**/*.html",
		bowerDir:	"./bower_components"
};

var output = {
		js: 		 	"dist/js",
		css: 		 	"dist/css",
		fonts: 	 	"dist/fonts",
		img: 		 	"dist/img/",
		html: 	 	"dist/**/*.html",
		root: 	 	"./dist",
		min_css: 	"main.min.css",
		min_js:  	"main.min.js"
};


// --------------------------------------------------------------------
// Error Handler
// --------------------------------------------------------------------

var onError = function(err) {
	console.log(err);
	this.emit('end');
}


// --------------------------------------------------------------------
// Task: Sass
// --------------------------------------------------------------------

gulp.task('sass', function() {

	return gulp.src(src.sass)
		.pipe(plumber({
			errorHandler: onError
		}))
		.pipe(sass())
		.pipe(prefix('last 15 versions'))
		.pipe(concat(output.min_css))
		.pipe(gulp.dest(output.css))
		.pipe(minify_css())
		.pipe(sourcemaps.init())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(output.css))
		.pipe(browserSync.reload({stream: true}));

});


// --------------------------------------------------------------------
// Task: Fonts
// --------------------------------------------------------------------

gulp.task('fonts', function() {

	return gulp.src([
					src.bowerDir + '/bootstrap-sass/assets/fonts/bootstrap/**/*',
					src.bowerDir + '/font-awesome/fonts/**/*'
        ])
		.pipe(gulp.dest(output.fonts));

});


// --------------------------------------------------------------------
// Task: JS
// --------------------------------------------------------------------

gulp.task('js', function() {

	return gulp.src([
					// src.bowerDir + '/jquery/dist/jquery.js', // jQuery CDN in use (index.html)
					src.bowerDir + '/bootstrap-sass/assets/javascripts/bootstrap.js',
					src.js
        ])
		.pipe(plumber({
			errorHandler: onError
		}))
		.pipe(jshint())
		.pipe(jshint.reporter('default'))
		.pipe(uglify())
		.pipe(concat(output.min_js))
		.pipe(sourcemaps.init())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(output.js))
		.pipe(browserSync.reload({stream: true}));

});


// --------------------------------------------------------------------
// Task: HTML
// --------------------------------------------------------------------

gulp.task('html', function() {

	return gulp.src(src.html)
		.pipe(gulp.dest(output.root))
		.pipe(browserSync.reload({stream: true}));

});


// --------------------------------------------------------------------
// Task: Image
// --------------------------------------------------------------------

gulp.task('img', function() {

	return gulp.src(src.img)
		.pipe(imagemin({
			progressive: true,
			svgoPlugins: [
				{removeViewBox: false},
				{cleanupIDs: false}
				],
			use: [pngquant()]
		}))
		.pipe(gulp.dest(output.img));

});


// --------------------------------------------------------------------
// Task: Watch
// --------------------------------------------------------------------

gulp.task('watch', function() {
	browserSync.init({
		server: './dist',
		notify: false
	});
	gulp.watch(src.js, ['js']);
	gulp.watch(src.sass, ['sass']);
	gulp.watch(src.html, ['html']);
	gulp.watch(src.img, ['img']);
	gulp.watch(output.html).on('change', browserSync.reload);

});


// --------------------------------------------------------------------
// Task: Default
// --------------------------------------------------------------------

gulp.task('default', ['watch', 'sass', 'fonts', 'img', 'js', 'html']);
